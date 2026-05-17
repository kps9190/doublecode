interface Option { value: string; label: string }
interface Props { value: string; options: readonly Option[]; onChange: (v: string) => void }
export default function SegmentSelect({ value, options, onChange }: Props) {
    return (
        <div className="flex gap-1 flex-wrap">
            {options.map((o) => (
                <button key={o.value} type="button" onClick={() => onChange(o.value)}
                    className={`px-3 h-8 rounded-lg border text-sm transition-colors ${
                        value === o.value
                            ? "bg-blue-600 text-white border-transparent"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}>{o.label}</button>
            ))}
        </div>
    );
}
