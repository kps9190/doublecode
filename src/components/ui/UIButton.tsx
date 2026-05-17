import type { ReactNode } from "react";
interface Props { children: ReactNode; variant?: "outline" | "solid"; size?: "sm" | "md"; disabled?: boolean; onClick?: () => void; className?: string }
export default function UIButton({ children, variant = "outline", size = "md", disabled, onClick, className = "" }: Props) {
    const base = "inline-flex items-center justify-center rounded-xl border transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    const sizing = size === "sm" ? "px-3 h-9 text-sm w-full" : "px-4 h-11 text-sm w-full";
    const style = variant === "solid"
        ? "bg-slate-950 text-white border-transparent hover:opacity-90 dark:bg-white dark:text-gray-900"
        : "bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700";
    return <button type="button" className={`${base} ${sizing} ${style} ${className}`} disabled={disabled} onClick={onClick}>{children}</button>;
}
