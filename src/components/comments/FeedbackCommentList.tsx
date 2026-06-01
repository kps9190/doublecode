import { useState } from "react";
import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";
import type { ActiveCommentEditor } from "./commentEditorState";
import FeedbackCommentItem from "./FeedbackCommentItem";
import CommentStateMessage from "./CommentStateMessage";

interface Props {
    comments: FeedbackComment[];
    error: string;
    language: Language;
    loading: boolean;
    maxLength: number;
    submitting: boolean;
    onDelete: (id: string, password: string) => Promise<boolean>;
    onEdit: (id: string, password: string, body: string) => Promise<boolean>;
    onReply: (parentId: string, authorName: string, password: string, body: string) => Promise<boolean>;
    onVerifyEdit: (id: string, password: string) => Promise<boolean>;
    t: (key: string) => string;
}

export default function FeedbackCommentList({
    comments,
    error,
    language,
    loading,
    maxLength,
    submitting,
    onDelete,
    onEdit,
    onReply,
    onVerifyEdit,
    t,
}: Props) {
    const [activeEditor, setActiveEditor] = useState<ActiveCommentEditor>(null);

    if (loading) {
        return <CommentStateMessage>{t("comments.loading")}</CommentStateMessage>;
    }

    if (error) {
        return <CommentStateMessage tone="warning">{t(error)}</CommentStateMessage>;
    }

    if (!comments.length) {
        return <CommentStateMessage>{t("comments.empty")}</CommentStateMessage>;
    }

    return (
        <div className="space-y-3">
            {comments.map((comment) => (
                <FeedbackCommentItem
                    key={comment.id}
                    activeEditor={activeEditor}
                    comment={comment}
                    depth={0}
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
    );
}
