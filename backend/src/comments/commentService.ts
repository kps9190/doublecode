import { validateCreateComment, validateUpdateComment } from "../domain/commentRules.ts";
import { httpError } from "../errors.ts";
import { hashIp, hashPassword, verifyPassword } from "../security.ts";
import type { CommentDto, CreateCommentInput, RequestMeta, UpdateCommentInput } from "../types.ts";
import { commentRepository, type CommentRepository } from "./commentRepository.ts";

export class CommentService {
    private readonly repository: CommentRepository;

    constructor(repository: CommentRepository = commentRepository) {
        this.repository = repository;
    }

    list(): CommentDto[] {
        return this.repository.listTree();
    }

    verifyPassword(id: number, password: string | undefined): { ok: true } {
        this.assertPasswordMatches(id, password || "");
        return { ok: true };
    }

    create(input: CreateCommentInput, requestMeta: RequestMeta): CommentDto | null {
        const authorName = (input.authorName || "").trim();
        const password = input.password || "";
        const body = (input.body || "").trim();
        const parentId = input.parentId ? Number(input.parentId) : null;
        const validationError = validateCreateComment({ authorName, password, body });

        if (validationError || (parentId !== null && !Number.isFinite(parentId))) {
            throw httpError(validationError || "invalid_parent_id", 400);
        }

        const id = this.repository.insert({
            parentId,
            authorName,
            passwordHash: hashPassword(password),
            body,
            ipHash: hashIp(requestMeta.ipAddress),
            userAgent: requestMeta.userAgent,
        });

        return this.repository.findDto(id);
    }

    delete(id: number, password: string | undefined): void {
        this.assertPasswordMatches(id, password || "");
        this.repository.markDeleted(id);
    }

    update(id: number, input: UpdateCommentInput, requestMeta: RequestMeta): CommentDto | null {
        const body = (input.body || "").trim();
        const validationError = validateUpdateComment({ body });

        if (validationError) {
            throw httpError(validationError, 400);
        }

        this.assertPasswordMatches(id, input.password || "");
        this.repository.updateBody({ id, body, userAgent: requestMeta.userAgent });
        return this.repository.findDto(id);
    }

    private assertPasswordMatches(id: number, password: string): void {
        const comment = this.repository.findVisiblePasswordRow(id);
        if (!comment || !verifyPassword(password, comment.password_hash)) {
            throw httpError("invalid_password", 403);
        }
    }
}

export const commentService = new CommentService();
