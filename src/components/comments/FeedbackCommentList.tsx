import { useState } from "react";
import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";
import type { ActiveCommentEditor } from "./commentEditorState";
import FeedbackCommentItem from "./FeedbackCommentItem";

interface Props {
    comments: FeedbackComment[];
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
        return <p className="text-sm text-slate-500 dark:text-slate-400">{t("comments.loading")}</p>;
    }

    if (!comments.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">{t("comments.empty")}</p>;
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
