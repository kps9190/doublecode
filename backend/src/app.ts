import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { HttpError } from "./errors.ts";
import { sendJson } from "./http.ts";
import { commentController, parseCommentRoute, type CommentController } from "./routes/commentRoutes.ts";

export class DoubleCodeApiServer {
    private readonly comments: CommentController;

    constructor(comments: CommentController = commentController) {
        this.comments = comments;
    }

    createHttpServer() {
        return createServer((req, res) => {
            void this.handle(req, res);
        });
    }

    private async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
        try {
            const route = parseCommentRoute(req);
            if (!route) {
                sendJson(res, 404, { error: "not_found" });
                return;
            }

            await this.comments.handle(req, res, route);
        } catch (error) {
            const statusCode = Number((error as Partial<HttpError>).statusCode || 500);
            sendJson(res, statusCode, {
                error: error instanceof Error ? error.message : "server_error",
            });
        }
    }
}
