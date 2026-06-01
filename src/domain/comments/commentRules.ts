export const COMMENT_LIMITS = {
    authorName: 10,
    password: 20,
    minPassword: 4,
    minBody: 10,
    body: 800,
} as const;

export const RESERVED_AUTHOR_NAMES = new Set(["개발자", "developer"]);

export function isReservedAuthorName(authorName: string) {
    return RESERVED_AUTHOR_NAMES.has(authorName.trim().toLowerCase());
}

export function normalizeCommentDraft(authorName: string, password: string, body: string) {
    return {
        authorName: authorName.trim(),
        password,
        body: body.trim(),
    };
}

export function isValidNewComment(authorName: string, password: string, body: string) {
    return getNewCommentValidationError(authorName, password, body) === null;
}

export function getNewCommentValidationError(authorName: string, password: string, body: string) {
    const draft = normalizeCommentDraft(authorName, password, body);

    if (!draft.authorName) return "comments.nameRequired";
    if (isReservedAuthorName(draft.authorName)) return "comments.reservedName";
    if (draft.authorName.length > COMMENT_LIMITS.authorName) return "comments.nameTooLong";
    if (draft.password.length < COMMENT_LIMITS.minPassword) return "comments.passwordTooShort";
    if (draft.password.length > COMMENT_LIMITS.password) return "comments.passwordTooLong";
    if (!draft.body) return "comments.bodyRequired";
    if (draft.body.length < COMMENT_LIMITS.minBody) return "comments.bodyTooShort";
    if (draft.body.length > COMMENT_LIMITS.body) return "comments.bodyTooLong";
    return null;
}

export function isValidCommentUpdate(password: string, body: string) {
    return getCommentUpdateValidationError(password, body) === null;
}

export function getCommentUpdateValidationError(password: string, body: string) {
    const trimmedBody = body.trim();

    if (!password) return "comments.passwordTooShort";
    if (!trimmedBody) return "comments.bodyRequired";
    if (trimmedBody.length < COMMENT_LIMITS.minBody) return "comments.bodyTooShort";
    if (trimmedBody.length > COMMENT_LIMITS.body) return "comments.bodyTooLong";
    return null;
}
