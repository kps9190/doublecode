import { useState } from "react";
import { COMMENT_LIMITS, getNewCommentValidationError } from "../../domain/comments/commentRules";
import CommentBodyField from "./CommentBodyField";
import CommentFormActions from "./CommentFormActions";
import CommentTextField from "./CommentTextField";

interface Props {
    disabled: boolean;
    maxLength: number;
    onCancel?: () => void;
    onSubmit: (authorName: string, password: string, body: string) => Promise<boolean>;
    submitLabel?: string;
    t: (key: string) => string;
}

export default function FeedbackCommentForm({ disabled, maxLength, onCancel, onSubmit, submitLabel, t }: Props) {
    const [authorName, setAuthorName] = useState("");
    const [password, setPassword] = useState("");
    const [body, setBody] = useState("");
    const canSubmit = body.length <= maxLength && !disabled;

    const getValidationMessage = () => {
        const errorKey = getNewCommentValidationError(authorName, password, body);
        return errorKey ? t(errorKey) : null;
    };

    const submit = async () => {
        if (!canSubmit) return;
        const validationMessage = getValidationMessage();
        if (validationMessage) {
            window.alert(validationMessage);
            return;
        }

        const submitted = await onSubmit(authorName, password, body);
        if (!submitted) {
            window.alert(t("comments.submitError"));
            return;
        }

        setAuthorName("");
        setPassword("");
        setBody("");
    };

    const cancel = () => {
        const hasDraft = Boolean(authorName.trim() || password || body.trim());
        if (hasDraft && !window.confirm(t("comments.cancelConfirm"))) return;

        setAuthorName("");
        setPassword("");
        setBody("");
        onCancel?.();
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2">
                <CommentTextField
                    ariaRequired
                    disabled={disabled}
                    maxLength={COMMENT_LIMITS.authorName}
                    value={authorName}
                    placeholder={t("comments.namePlaceholder")}
                    onChange={setAuthorName}
                    t={t}
                />
                <CommentTextField
                    ariaRequired
                    disabled={disabled}
                    maxLength={COMMENT_LIMITS.password}
                    type="password"
                    value={password}
                    placeholder={t("comments.passwordPlaceholder")}
                    onChange={setPassword}
                    t={t}
                />
            </div>
            <CommentBodyField
                disabled={disabled}
                maxLength={maxLength}
                value={body}
                placeholder={t("comments.bodyPlaceholder")}
                onChange={setBody}
                t={t}
            />
            <CommentFormActions
                cancelLabel={t("comments.cancel")}
                disabled={disabled}
                primaryDisabled={!canSubmit}
                primaryLabel={disabled ? t("comments.sending") : submitLabel || t("comments.submit")}
                onCancel={cancel}
                onPrimary={submit}
            />
        </div>
    );
}
