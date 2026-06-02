import ColorSwatchInput from "./ColorSwatchInput";

interface Props {
    label: string;
    value: string;
    ariaLabel?: string;
    onChange: (value: string) => void;
}

export default function InlineColorControl({ label, value, ariaLabel = label, onChange }: Props) {
    return (
        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            <ColorSwatchInput value={value} ariaLabel={ariaLabel} onChange={onChange} />
        </label>
    );
}
