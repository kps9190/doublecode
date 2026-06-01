import { db, runTransaction } from "../db.ts";
import type { CommentDto, CommentRow, PasswordCommentRow } from "../types.ts";
import { buildCommentTree, toCommentDto } from "./commentMapper.ts";

const commentColumns = `
    id, parent_id, author_name, author_role, password_hash, body, status,
    created_at, updated_at, edit_count, deleted_at
`;

interface InsertCommentArgs {
    parentId: number | null;
    authorName: string;
    passwordHash: string;
    body: string;
    ipHash: string | null;
    userAgent: string;
}

interface UpdateCommentBodyArgs {
    id: number;
    body: string;
    userAgent: string;
}

export class CommentRepository {
    listTree(): CommentDto[] {
        const rows = db.prepare(`
            SELECT ${commentColumns}
            FROM feedback_comments
            WHERE status != 'hidden'
            ORDER BY datetime(created_at) ASC, id ASC
        `).all() as unknown as CommentRow[];
        return buildCommentTree(rows);
    }

    findVisiblePasswordRow(id: number): PasswordCommentRow | undefined {
        return db.prepare(`
            SELECT id, password_hash
            FROM feedback_comments
            WHERE id = ? AND status = 'visible'
            LIMIT 1
        `).get(id) as PasswordCommentRow | undefined;
    }

    findDto(id: number): CommentDto | null {
        const row = db.prepare(`
            SELECT ${commentColumns}
            FROM feedback_comments
            WHERE id = ?
            LIMIT 1
        `).get(id) as CommentRow | undefined;
        return row ? toCommentDto(row) : null;
    }

    insert({ parentId, authorName, passwordHash, body, ipHash, userAgent }: InsertCommentArgs): number {
        const insert = db.prepare(`
            INSERT INTO feedback_comments
                (parent_id, author_name, author_role, password_hash, body, status, ip_hash, user_agent)
            VALUES (?, ?, 'user', ?, ?, 'visible', ?, ?)
        `);

        const insertRevision = db.prepare(`
            INSERT INTO feedback_comment_revisions
                (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
            VALUES (?, 'create', 0, NULL, ?, datetime('now'), ?, ?)
        `);

        return runTransaction(() => {
            const result = insert.run(parentId, authorName, passwordHash, body, ipHash, userAgent);
            insertRevision.run(result.lastInsertRowid, body, ipHash, userAgent);
            return Number(result.lastInsertRowid);
        });
    }

    markDeleted(id: number): void {
        db.prepare(`
            UPDATE feedback_comments
            SET status = 'deleted', deleted_at = datetime('now')
            WHERE id = ? AND status = 'visible'
        `).run(id);
    }

    updateBody({ id, body, userAgent }: UpdateCommentBodyArgs): void {
        const insertRevision = db.prepare(`
            INSERT INTO feedback_comment_revisions
                (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
            SELECT
                id,
                'update',
                edit_count + 1,
                body,
                ?,
                datetime('now'),
                ip_hash,
                ?
            FROM feedback_comments
            WHERE id = ? AND status = 'visible'
        `);

        const update = db.prepare(`
            UPDATE feedback_comments
            SET body = ?,
                updated_at = (
                    SELECT edited_at
                    FROM feedback_comment_revisions
                    WHERE comment_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                ),
                edit_count = edit_count + 1
            WHERE id = ? AND status = 'visible'
        `);

        runTransaction(() => {
            insertRevision.run(body, userAgent, id);
            update.run(body, id, id);
        });
    }
}

export const commentRepository = new CommentRepository();
