export type AuthorRole = "user" | "owner";
export type CommentStatus = "visible" | "deleted" | "hidden";
export type DatabaseId = number | string;
export type DatabaseDate = string | Date | null;

export interface CommentRow {
    id: DatabaseId;
    parent_id: DatabaseId | null;
    author_name: string | null;
    author_role: AuthorRole;
    password_hash: string;
    body: string;
    status: CommentStatus;
    created_at: DatabaseDate;
    updated_at: DatabaseDate;
    edit_count: number;
    deleted_at: DatabaseDate;
}

export interface PasswordCommentRow {
    id: DatabaseId;
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
