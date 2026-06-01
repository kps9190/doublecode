import { useState } from "react";
import type { FeedbackComment } from "../../types/comments";
import type { ActiveCommentEditor } from "./commentEditorState";

interface UseCommentItemEditorArgs {
    activeEditor: ActiveCommentEditor;
    comment: FeedbackComment;
    setActiveEditor: (editor: ActiveCommentEditor) => void;
    onDelete: (id: string, password: string) => Promise<boolean>;
    onEdit: (id: string, password: string, body: string) => Promise<boolean>;
    onReply: (parentId: string, authorName: string, password: string, body: string) => Promise<boolean>;
    onVerifyEdit: (id: string, password: string) => Promise<boolean>;
    passwordErrorText: string;
}

function isEditorOpen(activeEditor: ActiveCommentEditor, kind: NonNullable<ActiveCommentEditor>["kind"], commentId: string) {
    return activeEditor?.kind === kind && activeEditor.commentId === commentId;
}

/**
 * Coordinates the one-open-editor rule for a comment row.
 * Rendering stays in FeedbackCommentItem; password and submit flows live here.
 */
export function useCommentItemEditor({
    activeEditor,
    comment,
    setActiveEditor,
    onDelete,
    onEdit,
    onReply,
    onVerifyEdit,
    passwordErrorText,
}: UseCommentItemEditorArgs) {
    const [deletePassword, setDeletePassword] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editBody, setEditBody] = useState(comment.body);
    const [passwordDialogError, setPasswordDialogError] = useState("");

    const closeEditor = () => {
        setPasswordDialogError("");
        setEditPassword("");
        setDeletePassword("");
        setActiveEditor(null);
    };

    const toggleEditor = (kind: NonNullable<ActiveCommentEditor>["kind"]) => {
        const isSameEditor = isEditorOpen(activeEditor, kind, comment.id);
        setPasswordDialogError("");
        setEditPassword("");
        setDeletePassword("");
        setActiveEditor(isSameEditor ? null : { kind, commentId: comment.id });
    };

    const submitReply = async (authorName: string, password: string, body: string) => {
        const submitted = await onReply(comment.id, authorName, password, body);
        if (submitted) setActiveEditor(null);
        return submitted;
    };

    const verifyEditPassword = async () => {
        const verified = await onVerifyEdit(comment.id, editPassword);
        if (!verified) {
            setPasswordDialogError(passwordErrorText);
            return;
        }

        setEditBody(comment.body);
        setPasswordDialogError("");
        setActiveEditor({ kind: "edit", commentId: comment.id });
    };

    const deleteComment = async () => {
        const verified = await onVerifyEdit(comment.id, deletePassword);
        if (!verified) {
            setPasswordDialogError(passwordErrorText);
            return;
        }

        const deleted = await onDelete(comment.id, deletePassword);
        if (deleted) closeEditor();
    };

    const editComment = async () => {
        const edited = await onEdit(comment.id, editPassword, editBody);
        if (edited) closeEditor();
    };

    const changeDialogPassword = (setter: (value: string) => void) => (password: string) => {
        setter(password);
        setPasswordDialogError("");
    };

    return {
        deletePassword,
        editPassword,
        editBody,
        passwordDialogError,
        isReplyOpen: isEditorOpen(activeEditor, "reply", comment.id),
        isDeleteOpen: isEditorOpen(activeEditor, "delete", comment.id),
        isEditPasswordOpen: isEditorOpen(activeEditor, "edit-password", comment.id),
        isEditOpen: isEditorOpen(activeEditor, "edit", comment.id),
        setEditBody,
        closeEditor,
        toggleEditor,
        submitReply,
        verifyEditPassword,
        deleteComment,
        editComment,
        changeEditPassword: changeDialogPassword(setEditPassword),
        changeDeletePassword: changeDialogPassword(setDeletePassword),
    };
}
