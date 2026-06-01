import type { FeedbackComment } from "../../types/comments";
import type { Language } from "../../i18n";

export type CommentDateMode = "long" | "short";

const ENGLISH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatCommentDate(value: string, language: Language, mode: CommentDateMode = "long") {
    const [datePart, timePart = ""] = value.replace("T", " ").split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour = "00", minute = "00", second = "00"] = timePart.split(":");
    const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;

    if (mode === "short") {
        return `${String(year).slice(-2)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${time}`;
    }

    if (language === "en") {
        return `${ENGLISH_MONTHS[month - 1] ?? String(month).padStart(2, "0")} ${day}, ${year} ${time}`;
    }

    return `${year}년 ${month}월 ${day}일 ${time}`;
}

export function formatCommentEditLabel(comment: FeedbackComment, language: Language, t: (key: string) => string, mode: CommentDateMode = "long") {
    if (!comment.updatedAt || comment.editCount <= 0) return null;
    return `${t("comments.edited")}(${comment.editCount}${t("comments.editCountSuffix")}) ${formatCommentDate(comment.updatedAt, language, mode)}`;
}

export function formatCommentDeletedLabel(comment: FeedbackComment, language: Language, t: (key: string) => string, mode: CommentDateMode = "long") {
    if (!comment.deletedAt) return null;
    return `${t("comments.deletedAt")}: ${formatCommentDate(comment.deletedAt, language, mode)}`;
}
