interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function CodeTextOverrideInput({ value, onChange }: Props) {
    return (
        <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        />
    );
}
