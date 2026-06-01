import type { ReactNode } from "react";

interface Props {
    active: boolean;
    children: ReactNode;
    className?: string;
    onClick: () => void;
}

export default function ColorModeButton({ active, children, className = "", onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-7 rounded-lg border px-2.5 text-xs transition-colors ${
                active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            } ${className}`}
        >
            {children}
        </button>
    );
}
