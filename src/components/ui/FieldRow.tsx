import type { ReactNode } from "react";
interface Props { label: string; children: ReactNode }
export default function FieldRow({ label, children }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 py-2.5 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 grow-0 shrink-0 basis-36 md:basis-2/5">{label}</div>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
