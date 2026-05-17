import FieldRow from "./FieldRow";
interface Props { id: string; label?: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }
export default function RangeField({ id, label, min, max, step = 1, value, onChange }: Props) {
    const slider = (
        <div className="flex items-center gap-3 min-w-0">
            <input id={id} type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 min-w-0 w-full" />
            <span className="shrink-0 tabular-nums inline-block w-10 text-sm text-slate-600 dark:text-slate-400 text-right">{value}</span>
        </div>
    );
    return label ? <FieldRow label={label}>{slider}</FieldRow> : slider;
}
