import type { ReactNode } from "react";
interface Props { children: ReactNode; className?: string; title?: string }
export default function Card({ children, className = "", title }: Props) {
    return (
        <div className={`min-w-0 w-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
            {title && (
                <div className="px-4 pt-4 pb-0">
                    <h2 className="font-semibold text-slate-950 dark:text-white text-sm">{title}</h2>
                </div>
            )}
            <div className="px-4 py-4">{children}</div>
        </div>
    );
}
