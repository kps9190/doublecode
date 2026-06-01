export const COMMENT_LIMITS = {
    authorName: 10,
    password: 20,
    minPassword: 4,
    minBody: 10,
    body: 800,
};

const RESERVED_AUTHOR_NAMES = new Set(["개발자", "developer"]);

interface CommentValidationInput {
    authorName: string;
    password: string;
    body: string;
}

interface CommentUpdateValidationInput {
    body: string;
}

type CommentValidationError =
    | "author_name_required"
    | "reserved_author_name"
    | "author_name_too_long"
    | "password_too_short"
    | "password_too_long"
    | "body_required"
    | "body_too_short"
    | "body_too_long";

export function isReservedAuthorName(authorName: string): boolean {
    return RESERVED_AUTHOR_NAMES.has(authorName.trim().toLowerCase());
}

export function validateCreateComment({ authorName, password, body }: CommentValidationInput): CommentValidationError | null {
    if (!authorName) return "author_name_required";
    if (isReservedAuthorName(authorName)) return "reserved_author_name";
    if (authorName.length > COMMENT_LIMITS.authorName) return "author_name_too_long";
    if (password.length < COMMENT_LIMITS.minPassword) return "password_too_short";
    if (password.length > COMMENT_LIMITS.password) return "password_too_long";
    if (!body) return "body_required";
    if (body.length < COMMENT_LIMITS.minBody) return "body_too_short";
    if (body.length > COMMENT_LIMITS.body) return "body_too_long";
    return null;
}

export function validateUpdateComment({ body }: CommentUpdateValidationInput): CommentValidationError | null {
    if (!body) return "body_required";
    if (body.length < COMMENT_LIMITS.minBody) return "body_too_short";
    if (body.length > COMMENT_LIMITS.body) return "body_too_long";
    return null;
}
