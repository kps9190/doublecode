import { useFeedbackComments } from "../../hooks/comments/useFeedbackComments";
import { useI18n } from "../../i18n";
import FeedbackCommentForm from "./FeedbackCommentForm";
import FeedbackCommentList from "./FeedbackCommentList";

export default function FeedbackComments() {
    const { language, t } = useI18n();
    const comments = useFeedbackComments();

    return (
        <section className="mx-auto max-w-2xl text-left">
            <div className="mb-3 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-center">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("comments.title")}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("comments.description")}</p>
            </div>

            <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <FeedbackCommentForm
                        disabled={comments.submitting}
                        maxLength={comments.maxCommentLength}
                        onSubmit={comments.submit}
                        t={t}
                    />
                </div>

                <div>
                    <FeedbackCommentList
                        comments={comments.comments}
                        error={comments.error}
                        language={language}
                        loading={comments.loading}
                        maxLength={comments.maxCommentLength}
                        submitting={comments.submitting}
                        onDelete={comments.remove}
                        onEdit={comments.update}
                        onReply={(parentId, authorName, password, body) => comments.submit(authorName, password, body, parentId)}
                        onVerifyEdit={comments.verifyPassword}
                        t={t}
                    />
                </div>
            </div>
        </section>
    );
}
