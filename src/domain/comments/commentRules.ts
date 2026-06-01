export const COMMENT_LIMITS = {
    authorName: 10,
    password: 20,
    minPassword: 4,
    body: 800,
} as const;

export const RESERVED_AUTHOR_NAMES = new Set(["개발자", "developer"]);

export function isReservedAuthorName(authorName: string) {
    return RESERVED_AUTHOR_NAMES.has(authorName.trim().toLowerCase());
}
