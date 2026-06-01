import UIButton from "../ui/UIButton";

interface Props {
    cancelLabel: string;
    confirmLabel: string;
    disabled: boolean;
    error: string;
    help: string;
    password: string;
    placeholder: string;
    title: string;
    onCancel: () => void;
    onChangePassword: (password: string) => void;
    onConfirm: () => void;
}

export default function CommentPasswordDialog({
    cancelLabel,
    confirmLabel,
    disabled,
    error,
    help,
    password,
    placeholder,
    title,
    onCancel,
    onChangePassword,
    onConfirm,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{help}</p>
                <input
                    type="password"
                    value={password}
                    autoFocus
                    onChange={(event) => onChangePassword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onConfirm();
                        if (event.key === "Escape") onCancel();
                    }}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {error && <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-300">{error}</p>}
                <div className="mt-3 flex justify-end gap-2">
                    <UIButton size="sm" disabled={disabled} onClick={onCancel} className="!w-auto whitespace-nowrap px-3">
                        {cancelLabel}
                    </UIButton>
                    <UIButton size="sm" variant="solid" disabled={disabled || !password} onClick={onConfirm} className="!w-auto whitespace-nowrap px-3">
                        {confirmLabel}
                    </UIButton>
                </div>
            </div>
        </div>
    );
}
