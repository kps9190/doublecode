import FieldRow from "./FieldRow";
interface Option { value: string; label: string }
interface Props { label: string; value: string; options: readonly Option[]; onChange: (v: string) => void }
export default function SelectField({ label, value, options, onChange }: Props) {
    return (
        <FieldRow label={label}>
            <select value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-2 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </FieldRow>
    );
}
