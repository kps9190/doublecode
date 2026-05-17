import FieldRow from "./FieldRow";
interface Props { label: string; checked: boolean; onChange: (v: boolean) => void }
export default function Toggle({ label, checked, onChange }: Props) {
    return (
        <FieldRow label={label}>
            <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}>
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`} />
            </button>
        </FieldRow>
    );
}
