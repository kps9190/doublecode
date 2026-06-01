interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function SmallColorInput({ value, onChange }: Props) {
    return (
        <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-slate-300 bg-transparent p-0.5 dark:border-slate-600"
        />
    );
}
