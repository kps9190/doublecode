import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";
import { formatCommentDate, formatCommentDeletedLabel, formatCommentEditLabel } from "./commentDate";

interface StaffBadgeProps {
    t: (key: string) => string;
}

interface CommentAuthorLineProps {
    comment: FeedbackComment;
    language: Language;
    t: (key: string) => string;
}

interface CommentStatusBadgesProps {
    className?: string;
    comment: FeedbackComment;
    language: Language;
    t: (key: string) => string;
}

export function StaffBadge({ t }: StaffBadgeProps) {
    return (
        <span
            className="shrink-0 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-blue-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
            title={t("comments.ownerBadge")}
        >
            DEV
        </span>
    );
}

export function CommentAuthorLine({ comment, language, t }: CommentAuthorLineProps) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-100">
                {comment.authorName || t("comments.anonymous")}
            </h3>
            {comment.authorRole === "owner" && <StaffBadge t={t} />}
            <time className="min-w-0 truncate text-xs text-slate-400" dateTime={comment.createdAt}>
                <span className="sm:hidden">{formatCommentDate(comment.createdAt, language, "short")}</span>
                <span className="hidden sm:inline">{formatCommentDate(comment.createdAt, language)}</span>
            </time>
        </div>
    );
}

export function CommentStatusBadges({ className = "", comment, language, t }: CommentStatusBadgesProps) {
    const editLabel = formatCommentEditLabel(comment, language, t);
    const shortEditLabel = formatCommentEditLabel(comment, language, t, "short");
    const deletedLabel = formatCommentDeletedLabel(comment, language, t);
    const shortDeletedLabel = formatCommentDeletedLabel(comment, language, t, "short");
    const badgeClass = "rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300";

    if (!editLabel && !deletedLabel) return null;

    return (
        <div className={`mt-1 flex flex-wrap justify-start gap-1.5 ${className}`}>
            {editLabel && !comment.deleted && (
                <time className={badgeClass} dateTime={comment.updatedAt || undefined}>
                    <span className="md:hidden">{shortEditLabel}</span>
                    <span className="hidden md:inline">{editLabel}</span>
                </time>
            )}
            {deletedLabel && (
                <time className={badgeClass} dateTime={comment.deletedAt || undefined}>
                    <span className="sm:hidden">{shortDeletedLabel}</span>
                    <span className="hidden sm:inline">{deletedLabel}</span>
                </time>
            )}
        </div>
    );
}
