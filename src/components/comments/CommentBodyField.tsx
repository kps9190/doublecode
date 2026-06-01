import CommentClearButton from "./CommentClearButton";

interface Props {
    disabled: boolean;
    maxLength: number;
    placeholder?: string;
    value: string;
    autoFocus?: boolean;
    onChange: (value: string) => void;
    t: (key: string) => string;
}

export default function CommentBodyField({ disabled, maxLength, placeholder, value, autoFocus = false, onChange, t }: Props) {
    return (
        <div className="group relative">
            <textarea
                value={value}
                maxLength={maxLength}
                autoFocus={autoFocus}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 pb-7 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {value && <CommentClearButton disabled={disabled} onClear={() => onChange("")} t={t} />}
            <span className="pointer-events-none absolute bottom-2 right-3 rounded bg-white/90 px-1.5 text-[11px] tabular-nums text-slate-400 dark:bg-slate-800/90 dark:text-slate-500">
                {value.length}/{maxLength}
            </span>
        </div>
    );
}
