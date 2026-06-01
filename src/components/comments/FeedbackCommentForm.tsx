import { useState } from "react";
import { COMMENT_LIMITS, getNewCommentValidationError } from "../../domain/comments/commentRules";
import UIButton from "../ui/UIButton";

interface Props {
    disabled: boolean;
    maxLength: number;
    onCancel?: () => void;
    onSubmit: (authorName: string, password: string, body: string) => Promise<boolean>;
    submitLabel?: string;
    t: (key: string) => string;
}

interface ClearButtonProps {
    disabled: boolean;
    onClear: () => void;
    t: (key: string) => string;
}

function FieldClearButton({ disabled, onClear, t }: ClearButtonProps) {
    return (
        <button
            type="button"
            aria-label={t("comments.clear")}
            disabled={disabled}
            onClick={onClear}
            className="absolute right-2 top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-sm leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:grid focus:outline-none disabled:pointer-events-none dark:hover:bg-slate-700 dark:hover:text-slate-100 group-focus-within:grid"
        >
            ×
        </button>
    );
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
                <div className="group relative">
                    <input
                        type="text"
                        value={authorName}
                        maxLength={COMMENT_LIMITS.authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={t("comments.namePlaceholder")}
                        aria-required="true"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    {authorName && <FieldClearButton disabled={disabled} onClear={() => setAuthorName("")} t={t} />}
                </div>
                <div className="group relative">
                    <input
                        type="password"
                        value={password}
                        maxLength={COMMENT_LIMITS.password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("comments.passwordPlaceholder")}
                        aria-required="true"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    {password && <FieldClearButton disabled={disabled} onClear={() => setPassword("")} t={t} />}
                </div>
            </div>
            <div className="group relative">
                <textarea
                    value={body}
                    maxLength={maxLength}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={t("comments.bodyPlaceholder")}
                    className="min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 pb-7 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {body && <FieldClearButton disabled={disabled} onClear={() => setBody("")} t={t} />}
                <span className="pointer-events-none absolute bottom-2 right-3 rounded bg-white/90 px-1.5 text-[11px] tabular-nums text-slate-400 dark:bg-slate-800/90 dark:text-slate-500">
                    {body.length}/{maxLength}
                </span>
            </div>
            <div className="flex flex-nowrap items-center justify-end gap-2">
                <UIButton size="sm" disabled={disabled} onClick={cancel} className="h-8 !w-auto whitespace-nowrap px-2.5 text-xs">
                    {t("comments.cancel")}
                </UIButton>
                <UIButton
                    size="sm"
                    variant="solid"
                    disabled={!canSubmit}
                    onClick={submit}
                    className="h-8 !w-auto min-w-0 whitespace-nowrap px-3 text-xs"
                >
                    {disabled ? t("comments.sending") : submitLabel || t("comments.submit")}
                </UIButton>
            </div>
        </div>
    );
}
