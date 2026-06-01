import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";
import type { Plugin } from "vite";
import { COMMENT_LIMITS, isReservedAuthorName } from "../src/domain/comments/commentRules";

const execFileAsync = promisify(execFile);
const mockDbPath = resolve("database/doublecode_feedback_mock.sqlite");

interface CommentRow {
  id: number;
  parent_id: number | null;
  author_name: string | null;
  author_role: "user" | "owner";
  body: string;
  status: "visible" | "deleted" | "hidden";
  created_at: string;
  updated_at: string | null;
  edit_count: number;
  deleted_at: string | null;
}

interface CommentDto {
  id: string;
  parentId: string | null;
  authorName: string | null;
  authorRole: "user" | "owner";
  body: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  editCount: number;
  deletedAt: string | null;
  replies: CommentDto[];
}

interface DevRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  on: (event: "data" | "end" | "error", callback: (chunk?: unknown) => void) => void;
}

interface DevResponse {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
}

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function devPasswordHash(password: string) {
  return `mock_hash_${password}`;
}

async function sqliteJson<T>(sql: string): Promise<T[]> {
  const { stdout } = await execFileAsync("sqlite3", ["-json", mockDbPath, sql]);
  return stdout.trim() ? JSON.parse(stdout) as T[] : [];
}

async function sqliteExec(sql: string) {
  await execFileAsync("sqlite3", [mockDbPath, sql]);
}

async function readRequestJson<T>(req: DevRequest): Promise<T> {
  return new Promise((resolveJson, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolveJson(JSON.parse(body || "{}") as T);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", (error) => reject(error));
  });
}

function sendJson(res: DevResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function parseCommentPath(url = "") {
  const [rawPath] = url.split("?");
  const [idSegment, action] = rawPath.split("/").filter(Boolean);
  return { id: Number(idSegment), action };
}

function userAgentOf(req: DevRequest) {
  return String(req.headers["user-agent"] || "Vite dev server");
}

function toCommentDto(row: CommentRow): CommentDto {
  const deleted = row.status === "deleted";
  return {
    id: String(row.id),
    parentId: row.parent_id === null ? null : String(row.parent_id),
    authorName: row.author_name,
    authorRole: row.author_role,
    body: deleted ? "" : row.body,
    deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    editCount: row.edit_count,
    deletedAt: row.deleted_at,
    replies: [],
  };
}

function buildCommentTree(rows: CommentRow[]) {
  const byId = new Map<number, CommentDto>();
  const roots: CommentDto[] = [];

  for (const row of rows) byId.set(row.id, toCommentDto(row));

  for (const row of rows) {
    const comment = byId.get(row.id);
    if (!comment) continue;

    if (row.parent_id && byId.has(row.parent_id)) {
      byId.get(row.parent_id)?.replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  const prune = (comment: CommentDto): CommentDto | null => {
    comment.replies = comment.replies
      .map(prune)
      .filter((reply): reply is CommentDto => !!reply);
    if (comment.deleted && comment.replies.length === 0) return null;
    return comment;
  };

  return roots
    .map(prune)
    .filter((comment): comment is CommentDto => !!comment)
    .reverse();
}

function isInvalidCreateInput(authorName: string, password: string, body: string) {
  return !authorName
    || isReservedAuthorName(authorName)
    || authorName.length > COMMENT_LIMITS.authorName
    || password.length < COMMENT_LIMITS.minPassword
    || password.length > COMMENT_LIMITS.password
    || !body
    || body.length > COMMENT_LIMITS.body;
}

async function listComments() {
  const rows = await sqliteJson<CommentRow>(`
    SELECT id, parent_id, author_name, author_role, body, status, created_at, updated_at, edit_count, deleted_at
    FROM feedback_comments
    WHERE status != 'hidden'
    ORDER BY datetime(created_at) ASC, id ASC
  `);
  return buildCommentTree(rows);
}

async function passwordMatches(id: number, password: string) {
  if (!Number.isFinite(id)) return false;

  const matches = await sqliteJson<{ id: number }>(`
    SELECT id FROM feedback_comments
    WHERE id = ${id}
      AND password_hash = ${sqlString(devPasswordHash(password))}
      AND status = 'visible'
    LIMIT 1
  `);
  return matches.length > 0;
}

async function createComment(req: DevRequest, res: DevResponse) {
  const input = await readRequestJson<{ authorName?: string; password?: string; body?: string; parentId?: string | null }>(req);
  const authorName = input.authorName?.trim() || "";
  const password = input.password || "";
  const body = input.body?.trim() || "";
  const parentId = input.parentId ? Number(input.parentId) : null;

  if (isInvalidCreateInput(authorName, password, body)) {
    sendJson(res, 400, { error: "invalid_comment" });
    return;
  }

  const userAgent = userAgentOf(req);
  await sqliteExec(`
    BEGIN;
    INSERT INTO feedback_comments (parent_id, author_name, author_role, password_hash, body, status, user_agent)
    VALUES (
      ${parentId ? String(parentId) : "NULL"},
      ${sqlString(authorName)},
      'user',
      ${sqlString(devPasswordHash(password))},
      ${sqlString(body)},
      'visible',
      ${sqlString(userAgent)}
    );

    INSERT INTO feedback_comment_revisions (
      comment_id,
      revision_type,
      revision_no,
      previous_body,
      new_body,
      edited_at,
      ip_hash,
      user_agent
    )
    VALUES (
      last_insert_rowid(),
      'create',
      0,
      NULL,
      ${sqlString(body)},
      datetime('now', 'localtime'),
      NULL,
      ${sqlString(userAgent)}
    );
    COMMIT;
  `);
  sendJson(res, 201, (await listComments())[0] || null);
}

async function verifyPassword(req: DevRequest, res: DevResponse, id: number) {
  const input = await readRequestJson<{ password?: string }>(req);
  if (!(await passwordMatches(id, input.password || ""))) {
    sendJson(res, 403, { error: "invalid_password" });
    return;
  }

  sendJson(res, 200, { ok: true });
}

async function deleteComment(req: DevRequest, res: DevResponse, id: number) {
  const input = await readRequestJson<{ password?: string }>(req);
  if (!(await passwordMatches(id, input.password || ""))) {
    sendJson(res, 403, { error: "invalid_password" });
    return;
  }

  await sqliteExec(`
    UPDATE feedback_comments
    SET status = 'deleted', deleted_at = datetime('now', 'localtime')
    WHERE id = ${id}
  `);
  res.statusCode = 204;
  res.end();
}

async function updateComment(req: DevRequest, res: DevResponse, id: number) {
  const input = await readRequestJson<{ password?: string; body?: string }>(req);
  const body = input.body?.trim() || "";

  if (!body || body.length > COMMENT_LIMITS.body) {
    sendJson(res, 400, { error: "invalid_comment" });
    return;
  }

  if (!(await passwordMatches(id, input.password || ""))) {
    sendJson(res, 403, { error: "invalid_password" });
    return;
  }

  const userAgent = userAgentOf(req);
  await sqliteExec(`
    BEGIN;
    INSERT INTO feedback_comment_revisions (
      comment_id,
      revision_type,
      revision_no,
      previous_body,
      new_body,
      edited_at,
      ip_hash,
      user_agent
    )
    SELECT
      id,
      'update',
      edit_count + 1,
      body,
      ${sqlString(body)},
      datetime('now', 'localtime'),
      ip_hash,
      ${sqlString(userAgent)}
    FROM feedback_comments
    WHERE id = ${id}
      AND status = 'visible';

    UPDATE feedback_comments
    SET body = ${sqlString(body)},
        updated_at = (
          SELECT edited_at
          FROM feedback_comment_revisions
          WHERE comment_id = ${id}
          ORDER BY id DESC
          LIMIT 1
        ),
        edit_count = edit_count + 1
    WHERE id = ${id}
      AND status = 'visible';
    COMMIT;
  `);

  const updated = await sqliteJson<CommentRow>(`
    SELECT id, parent_id, author_name, author_role, body, status, created_at, updated_at, edit_count, deleted_at
    FROM feedback_comments
    WHERE id = ${id}
    LIMIT 1
  `);
  sendJson(res, 200, updated[0] ? toCommentDto(updated[0]) : null);
}

async function routeCommentsRequest(req: DevRequest, res: DevResponse) {
  if (req.method === "GET") {
    sendJson(res, 200, await listComments());
    return;
  }

  const { id, action } = parseCommentPath(req.url);

  if (req.method === "POST" && action === "verify-password") {
    await verifyPassword(req, res, id);
    return;
  }

  if (req.method === "POST") {
    await createComment(req, res);
    return;
  }

  if (req.method === "DELETE") {
    await deleteComment(req, res, id);
    return;
  }

  if (req.method === "PATCH") {
    await updateComment(req, res, id);
    return;
  }

  sendJson(res, 405, { error: "method_not_allowed" });
}

export function mockCommentsApi(): Plugin {
  return {
    name: "doublecode-mock-comments-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/comments", async (req, res) => {
        try {
          await routeCommentsRequest(req as DevRequest, res as DevResponse);
        } catch (error) {
          sendJson(res as DevResponse, 500, { error: error instanceof Error ? error.message : "mock_api_error" });
        }
      });
    },
  };
}
