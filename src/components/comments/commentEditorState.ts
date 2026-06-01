export type ActiveCommentEditor =
    | { kind: "reply"; commentId: string }
    | { kind: "delete"; commentId: string }
    | { kind: "edit-password"; commentId: string }
    | { kind: "edit"; commentId: string }
    | null;
