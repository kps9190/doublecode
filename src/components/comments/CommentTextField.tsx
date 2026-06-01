import CommentClearButton from "./CommentClearButton";

interface Props {
    ariaRequired?: boolean;
    disabled: boolean;
    maxLength: number;
    placeholder: string;
    type?: "text" | "password";
    value: string;
    onChange: (value: string) => void;
    t: (key: string) => string;
}

export default function CommentTextField({
    ariaRequired = false,
    disabled,
    maxLength,
    placeholder,
    type = "text",
    value,
    onChange,
    t,
}: Props) {
    return (
        <div className="group relative">
            <input
                type={type}
                value={value}
                maxLength={maxLength}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-required={ariaRequired}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {value && <CommentClearButton disabled={disabled} onClear={() => onChange("")} t={t} />}
        </div>
    );
}
