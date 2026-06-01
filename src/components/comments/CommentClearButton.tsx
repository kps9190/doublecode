interface Props {
    disabled: boolean;
    onClear: () => void;
    t: (key: string) => string;
}

export default function CommentClearButton({ disabled, onClear, t }: Props) {
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
