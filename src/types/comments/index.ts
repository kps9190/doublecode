export type FeedbackCommentRole = "user" | "owner";

export interface FeedbackComment {
    id: string;
    parentId: string | null;
    authorName: string | null;
    authorRole: FeedbackCommentRole;
    body: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string | null;
    editCount: number;
    deletedAt: string | null;
    replies: FeedbackComment[];
}

export interface CreateFeedbackCommentInput {
    authorName: string;
    password: string;
    body: string;
    parentId?: string | null;
}

export interface DeleteFeedbackCommentInput {
    password: string;
}

export interface VerifyFeedbackCommentPasswordInput {
    password: string;
}

export interface UpdateFeedbackCommentInput {
    body: string;
    password: string;
}
