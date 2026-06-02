interface Props {
    value: string;
    ariaLabel: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function ColorSwatchInput({ value, ariaLabel, onChange, className = "h-8 w-10" }: Props) {
    return (
        <input
            type="color"
            value={value}
            aria-label={ariaLabel}
            onChange={(event) => onChange(event.target.value)}
            className={`${className} cursor-pointer rounded border border-slate-300 bg-transparent p-0.5 dark:border-slate-600`}
        />
    );
}
