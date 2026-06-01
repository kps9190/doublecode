export type AuthorRole = "user" | "owner";
export type CommentStatus = "visible" | "deleted" | "hidden";

export interface CommentRow {
    id: number;
    parent_id: number | null;
    author_name: string | null;
    author_role: AuthorRole;
    password_hash: string;
    body: string;
    status: CommentStatus;
    created_at: string;
    updated_at: string | null;
    edit_count: number;
    deleted_at: string | null;
}

export interface PasswordCommentRow {
    id: number;
    password_hash: string;
}

export interface CommentDto {
    id: string;
    parentId: string | null;
    authorName: string | null;
    authorRole: AuthorRole;
    body: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string | null;
    editCount: number;
    deletedAt: string | null;
    replies: CommentDto[];
}

export interface RequestMeta {
    ipAddress: string;
    userAgent: string;
}

export interface CreateCommentInput {
    authorName?: string;
    password?: string;
    body?: string;
    parentId?: string | null;
}

export interface UpdateCommentInput {
    password?: string;
    body?: string;
}

export interface PasswordInput {
    password?: string;
}

export interface CommentRoute {
    id: number | null;
    action: string | null;
}
