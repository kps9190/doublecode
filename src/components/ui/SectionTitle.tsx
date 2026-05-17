import type { ReactNode } from "react";
export default function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-500 first:mt-1">
            {children}
        </p>
    );
}
