import FieldRow from "./FieldRow";
import { useRangeNumberInput } from "./useRangeNumberInput";

interface Props { id: string; label?: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }

export default function RangeField({ id, label, min, max, step = 1, value, onChange }: Props) {
    const { draftValue, changeDraftValue, commitDraftValue } = useRangeNumberInput({ min, max, value, onChange });

    const slider = (
        <div className="flex items-center gap-2 min-w-0">
            <input id={id} type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 min-w-0 w-full" />
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={draftValue}
                onChange={(e) => changeDraftValue(e.target.value)}
                onBlur={commitDraftValue}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                }}
                className="h-8 w-16 shrink-0 rounded-lg border border-slate-300 bg-white px-2 text-right text-sm tabular-nums text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
        </div>
    );
    return label ? <FieldRow label={label}>{slider}</FieldRow> : slider;
}
