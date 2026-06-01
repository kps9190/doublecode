import type { CommentDto, CommentRow } from "../types.ts";

export function toCommentDto(row: CommentRow): CommentDto {
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

export function buildCommentTree(rows: CommentRow[]): CommentDto[] {
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
        comment.replies = comment.replies.map(prune).filter((reply): reply is CommentDto => !!reply);
        if (comment.deleted && comment.replies.length === 0) return null;
        return comment;
    };

    return roots.map(prune).filter((comment): comment is CommentDto => !!comment).reverse();
}
