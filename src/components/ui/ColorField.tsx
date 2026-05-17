import FieldRow from "./FieldRow";
interface Props { label: string; value: string; onChange: (v: string) => void }
export default function ColorField({ label, value, onChange }: Props) {
    return (
        <FieldRow label={label}>
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-slate-300 p-0.5 bg-transparent dark:border-slate-600" />
        </FieldRow>
    );
}
