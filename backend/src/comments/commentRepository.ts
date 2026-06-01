import { pool, runTransaction } from "../db.ts";
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
    async listTree(): Promise<CommentDto[]> {
        const result = await pool.query<CommentRow>(`
            SELECT ${commentColumns}
            FROM feedback_comments
            WHERE status != 'hidden'
            ORDER BY created_at ASC, id ASC
        `);
        return buildCommentTree(result.rows);
    }

    async findVisiblePasswordRow(id: number): Promise<PasswordCommentRow | undefined> {
        const result = await pool.query<PasswordCommentRow>(`
            SELECT id, password_hash
            FROM feedback_comments
            WHERE id = $1 AND status = 'visible'
            LIMIT 1
        `, [id]);
        return result.rows[0];
    }

    async findDto(id: number): Promise<CommentDto | null> {
        const result = await pool.query<CommentRow>(`
            SELECT ${commentColumns}
            FROM feedback_comments
            WHERE id = $1
            LIMIT 1
        `, [id]);
        const row = result.rows[0];
        return row ? toCommentDto(row) : null;
    }

    async insert({ parentId, authorName, passwordHash, body, ipHash, userAgent }: InsertCommentArgs): Promise<number> {
        return runTransaction(async (client) => {
            const inserted = await client.query<{ id: string }>(`
                INSERT INTO feedback_comments
                    (parent_id, author_name, author_role, password_hash, body, status, ip_hash, user_agent)
                VALUES ($1, $2, 'user', $3, $4, 'visible', $5, $6)
                RETURNING id
            `, [parentId, authorName, passwordHash, body, ipHash, userAgent]);
            const commentId = Number(inserted.rows[0]?.id);

            await client.query(`
                INSERT INTO feedback_comment_revisions
                    (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
                VALUES ($1, 'create', 0, NULL, $2, now(), $3, $4)
            `, [commentId, body, ipHash, userAgent]);

            return commentId;
        });
    }

    async markDeleted(id: number): Promise<void> {
        await pool.query(`
            UPDATE feedback_comments
            SET status = 'deleted', deleted_at = now()
            WHERE id = $1 AND status = 'visible'
        `, [id]);
    }

    async updateBody({ id, body, userAgent }: UpdateCommentBodyArgs): Promise<void> {
        await runTransaction(async (client) => {
            await client.query(`
                INSERT INTO feedback_comment_revisions
                    (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
                SELECT
                    id,
                    'update',
                    edit_count + 1,
                    body,
                    $1,
                    now(),
                    ip_hash,
                    $2
                FROM feedback_comments
                WHERE id = $3 AND status = 'visible'
            `, [body, userAgent, id]);

            await client.query(`
                UPDATE feedback_comments
                SET body = $1,
                    updated_at = (
                        SELECT edited_at
                        FROM feedback_comment_revisions
                        WHERE comment_id = $2
                        ORDER BY id DESC
                        LIMIT 1
                    ),
                    edit_count = edit_count + 1
                WHERE id = $3 AND status = 'visible'
            `, [body, id, id]);
        });
    }
}

export const commentRepository = new CommentRepository();
