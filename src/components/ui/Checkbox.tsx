interface Props { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }
export default function Checkbox({ label, checked, onChange, disabled = false }: Props) {
    return (
        <label className={`flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-slate-300 bg-white accent-blue-500 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700"
            />
            {label}
        </label>
    );
}
