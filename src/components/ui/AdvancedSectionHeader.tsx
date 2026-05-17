import SectionTitle from "./SectionTitle";

interface Props {
    title: string;
    advanced: boolean;
    label: string;
    onToggle: () => void;
}

export default function AdvancedSectionHeader({ title, advanced, label, onToggle }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <SectionTitle>{title}</SectionTitle>
            <button
                type="button"
                onClick={onToggle}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-colors ${
                    advanced
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
            >
                {advanced && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                {label}
            </button>
        </div>
    );
}
