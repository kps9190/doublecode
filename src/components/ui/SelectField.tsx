import FieldRow from "./FieldRow";
interface Option { value: string; label: string }
interface Props { label: string; value: string; options: readonly Option[]; onChange: (v: string) => void; compact?: boolean }
export default function SelectField({ label, value, options, onChange, compact = false }: Props) {
    if (compact) {
        return (
            <label className="block border-b border-slate-200 py-2 dark:border-slate-700">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <select value={value} onChange={(e) => onChange(e.target.value)}
                    className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </label>
        );
    }

    return (
        <FieldRow label={label}>
            <select value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-2 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </FieldRow>
    );
}
