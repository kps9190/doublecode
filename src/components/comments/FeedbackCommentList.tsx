import { useState } from "react";
import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";
import type { ActiveCommentEditor } from "./commentEditorState";
import FeedbackCommentItem from "./FeedbackCommentItem";

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
        return (
            <p className="rounded-lg border border-slate-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {t("comments.loading")}
            </p>
        );
    }

    if (error) {
        return (
            <p className="rounded-lg border border-amber-200 px-4 py-5 text-center text-sm text-amber-700 dark:border-amber-900/70 dark:text-amber-300">
                {t(error)}
            </p>
        );
    }

    if (!comments.length) {
        return (
            <p className="rounded-lg border border-slate-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {t("comments.empty")}
            </p>
        );
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
