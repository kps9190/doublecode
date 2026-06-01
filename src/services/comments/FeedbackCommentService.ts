import type {
    CreateFeedbackCommentInput,
    DeleteFeedbackCommentInput,
    FeedbackComment,
    UpdateFeedbackCommentInput,
    VerifyFeedbackCommentPasswordInput,
} from "../../types/comments";

const DEFAULT_ENDPOINT = "/api/comments";

function getCommentsEndpoint() {
    return import.meta.env.VITE_COMMENTS_API_URL || DEFAULT_ENDPOINT;
}

async function parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) throw new Error(`Comment API failed: ${response.status}`);
    return response.json() as Promise<T>;
}

export class FeedbackCommentService {
    constructor(private readonly endpoint = getCommentsEndpoint()) {}

    async list(): Promise<FeedbackComment[]> {
        const response = await fetch(this.endpoint, {
            headers: { Accept: "application/json" },
        });
        return parseResponse<FeedbackComment[]>(response);
    }

    async create(input: CreateFeedbackCommentInput): Promise<FeedbackComment> {
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        return parseResponse<FeedbackComment>(response);
    }

    async delete(id: string, input: DeleteFeedbackCommentInput): Promise<void> {
        const response = await fetch(`${this.endpoint}/${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) throw new Error(`Comment API failed: ${response.status}`);
    }

    async verifyPassword(id: string, input: VerifyFeedbackCommentPasswordInput): Promise<void> {
        const response = await fetch(`${this.endpoint}/${encodeURIComponent(id)}/verify-password`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) throw new Error(`Comment API failed: ${response.status}`);
    }

    async update(id: string, input: UpdateFeedbackCommentInput): Promise<FeedbackComment> {
        const response = await fetch(`${this.endpoint}/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        return parseResponse<FeedbackComment>(response);
    }
}
