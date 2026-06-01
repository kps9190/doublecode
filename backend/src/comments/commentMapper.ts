import type { CommentDto, CommentRow } from "../types.ts";

function toDateString(value: CommentRow["created_at"]): string | null {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString().replace("T", " ").slice(0, 19);
    return String(value);
}

export function toCommentDto(row: CommentRow): CommentDto {
    const deleted = row.status === "deleted";

    return {
        id: String(row.id),
        parentId: row.parent_id === null ? null : String(row.parent_id),
        authorName: row.author_name,
        authorRole: row.author_role,
        body: deleted ? "" : row.body,
        deleted,
        createdAt: toDateString(row.created_at) || "",
        updatedAt: toDateString(row.updated_at),
        editCount: row.edit_count,
        deletedAt: toDateString(row.deleted_at),
        replies: [],
    };
}

export function buildCommentTree(rows: CommentRow[]): CommentDto[] {
    const byId = new Map<string, CommentDto>();
    const roots: CommentDto[] = [];

    for (const row of rows) byId.set(String(row.id), toCommentDto(row));

    for (const row of rows) {
        const comment = byId.get(String(row.id));
        if (!comment) continue;

        const parentId = row.parent_id === null ? null : String(row.parent_id);
        if (parentId && byId.has(parentId)) {
            byId.get(parentId)?.replies.push(comment);
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
