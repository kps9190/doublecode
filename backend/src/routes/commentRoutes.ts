import type { IncomingMessage, ServerResponse } from "node:http";
import { sendEmpty, sendJson, readJson, getRequestMeta } from "../http.ts";
import type { CommentRoute, CreateCommentInput, PasswordInput, UpdateCommentInput } from "../types.ts";
import { commentService, type CommentService } from "../comments/commentService.ts";

export function parseCommentRoute(req: IncomingMessage): CommentRoute | null {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const match = url.pathname.match(/^\/api\/comments(?:\/([^/]+))?(?:\/([^/]+))?$/);
    if (!match) return null;

    return {
        id: match[1] ? Number(match[1]) : null,
        action: match[2] || null,
    };
}

export class CommentController {
    private readonly service: CommentService;

    constructor(service: CommentService = commentService) {
        this.service = service;
    }

    async handle(req: IncomingMessage, res: ServerResponse, route: CommentRoute): Promise<void> {
        if (req.method === "OPTIONS") {
            sendEmpty(res, 204);
            return;
        }

        if (req.method === "GET" && route.id === null) {
            sendJson(res, 200, this.service.list());
            return;
        }

        if (req.method === "POST" && route.id === null) {
            const input = await readJson<CreateCommentInput>(req);
            sendJson(res, 201, this.service.create(input, getRequestMeta(req)));
            return;
        }

        if (route.id === null || !Number.isFinite(route.id)) {
            sendJson(res, 404, { error: "not_found" });
            return;
        }

        await this.handleCommentMutation(req, res, route.id, route.action);
    }

    private async handleCommentMutation(
        req: IncomingMessage,
        res: ServerResponse,
        commentId: number,
        action: string | null,
    ): Promise<void> {
        if (req.method === "POST" && action === "verify-password") {
            const input = await readJson<PasswordInput>(req);
            sendJson(res, 200, this.service.verifyPassword(commentId, input.password));
            return;
        }

        if (req.method === "PATCH" && action === null) {
            const input = await readJson<UpdateCommentInput>(req);
            sendJson(res, 200, this.service.update(commentId, input, getRequestMeta(req)));
            return;
        }

        if (req.method === "DELETE" && action === null) {
            const input = await readJson<PasswordInput>(req);
            this.service.delete(commentId, input.password);
            sendEmpty(res, 204);
            return;
        }

        sendJson(res, 405, { error: "method_not_allowed" });
    }
}

export const commentController = new CommentController();
