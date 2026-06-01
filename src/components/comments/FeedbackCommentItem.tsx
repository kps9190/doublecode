import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";
import { getCommentUpdateValidationError } from "../../domain/comments/commentRules";
import CommentActionButton from "./CommentActionButton";
import CommentBodyField from "./CommentBodyField";
import CommentFormActions from "./CommentFormActions";
import CommentPasswordDialog from "./CommentPasswordDialog";
import { CommentAuthorLine, CommentStatusBadges } from "./CommentMeta";
import type { ActiveCommentEditor } from "./commentEditorState";
import FeedbackCommentForm from "./FeedbackCommentForm";
import { useCommentItemEditor } from "./useCommentItemEditor";

interface Props {
    activeEditor: ActiveCommentEditor;
    comment: FeedbackComment;
    depth: number;
    language: Language;
    maxLength: number;
    submitting: boolean;
    setActiveEditor: (editor: ActiveCommentEditor) => void;
    onDelete: (id: string, password: string) => Promise<boolean>;
    onEdit: (id: string, password: string, body: string) => Promise<boolean>;
    onReply: (parentId: string, authorName: string, password: string, body: string) => Promise<boolean>;
    onVerifyEdit: (id: string, password: string) => Promise<boolean>;
    t: (key: string) => string;
}

function getContainerClass(depth: number) {
    return depth === 0
        ? "rounded-lg border border-slate-200 p-3 text-left dark:border-slate-700"
        : "border-t border-slate-200 pt-3 pl-3 text-left dark:border-slate-700";
}

export default function FeedbackCommentItem({
    activeEditor,
    comment,
    depth,
    language,
    maxLength,
    submitting,
    setActiveEditor,
    onDelete,
    onEdit,
    onReply,
    onVerifyEdit,
    t,
}: Props) {
    const visibleBody = comment.deleted ? t("comments.deleted") : comment.body;
    const editor = useCommentItemEditor({
        activeEditor,
        comment,
        setActiveEditor,
        onDelete,
        onEdit,
        onReply,
        onVerifyEdit,
        passwordErrorText: t("comments.passwordCheckError"),
    });

    return (
        <article>
            <div className={getContainerClass(depth)}>
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CommentAuthorLine comment={comment} language={language} t={t} />
                        <CommentStatusBadges className="md:hidden" comment={comment} language={language} t={t} />
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <CommentStatusBadges className="!mt-0 hidden justify-end md:flex" comment={comment} language={language} t={t} />
                        {!comment.deleted && !editor.isEditOpen && (
                            <div className="flex gap-2">
                                <CommentActionButton onClick={() => editor.toggleEditor("edit-password")}>
                                    {t("comments.edit")}
                                </CommentActionButton>
                                <CommentActionButton onClick={() => editor.toggleEditor("delete")}>
                                    {t("comments.delete")}
                                </CommentActionButton>
                            </div>
                        )}
                    </div>
                </div>

                {editor.isEditOpen ? (
                    <div className="mt-2">
                        <CommentBodyField
                            disabled={submitting}
                            maxLength={maxLength}
                            value={editor.editBody}
                            autoFocus
                            onChange={editor.setEditBody}
                            t={t}
                        />
                    </div>
                ) : (
                    <p className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 ${
                        comment.deleted ? "text-slate-400 dark:text-slate-500" : "text-slate-600 dark:text-slate-300"
                    }`}>
                        {visibleBody}
                    </p>
                )}

                {!comment.deleted && !editor.isEditOpen && (
                    <div className="mt-3 flex gap-2">
                        <CommentActionButton tone="primary" onClick={() => editor.toggleEditor("reply")}>
                            {t("comments.reply")}
                        </CommentActionButton>
                    </div>
                )}

                {editor.isReplyOpen && (
                    <div className="mt-3">
                        <FeedbackCommentForm
                            disabled={submitting}
                            maxLength={maxLength}
                            onCancel={editor.closeEditor}
                            onSubmit={editor.submitReply}
                            submitLabel={t("comments.replySubmit")}
                            t={t}
                        />
                    </div>
                )}

                {editor.isEditOpen && (
                    <div className="mt-2">
                        <CommentFormActions
                            cancelLabel={t("comments.cancel")}
                            disabled={submitting}
                            primaryDisabled={!editor.editBody.trim()}
                            primaryLabel={t("comments.edit")}
                            onCancel={editor.closeEditor}
                            onPrimary={() => {
                                const validationError = getCommentUpdateValidationError(editor.editPassword, editor.editBody);
                                if (validationError) {
                                    window.alert(t(validationError));
                                    return;
                                }

                                void editor.editComment();
                            }}
                        />
                    </div>
                )}

                {editor.isEditPasswordOpen && (
                    <CommentPasswordDialog
                        cancelLabel={t("comments.cancel")}
                        confirmLabel={t("comments.confirm")}
                        disabled={submitting}
                        error={editor.passwordDialogError}
                        help={t("comments.editPasswordHelp")}
                        password={editor.editPassword}
                        placeholder={t("comments.editPasswordPlaceholder")}
                        title={t("comments.editPasswordTitle")}
                        onCancel={editor.closeEditor}
                        onChangePassword={editor.changeEditPassword}
                        onConfirm={editor.verifyEditPassword}
                    />
                )}

                {editor.isDeleteOpen && (
                    <CommentPasswordDialog
                        cancelLabel={t("comments.cancel")}
                        confirmLabel={t("comments.confirmDelete")}
                        disabled={submitting}
                        error={editor.passwordDialogError}
                        help={t("comments.deletePasswordHelp")}
                        password={editor.deletePassword}
                        placeholder={t("comments.deletePasswordPlaceholder")}
                        title={t("comments.deletePasswordTitle")}
                        onCancel={editor.closeEditor}
                        onChangePassword={editor.changeDeletePassword}
                        onConfirm={editor.deleteComment}
                    />
                )}

                {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                            <FeedbackCommentItem
                                key={reply.id}
                                activeEditor={activeEditor}
                                comment={reply}
                                depth={depth + 1}
                                language={language}
                                maxLength={maxLength}
                                submitting={submitting}
                                setActiveEditor={setActiveEditor}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                onReply={onReply}
                                onVerifyEdit={onVerifyEdit}
                                t={t}
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
