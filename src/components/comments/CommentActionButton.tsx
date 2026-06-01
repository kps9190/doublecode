import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    tone?: "muted" | "primary";
    onClick: () => void;
}

const toneClass = {
    muted: "text-slate-500 dark:text-slate-400",
    primary: "text-blue-600 dark:text-cyan-300",
} as const;

export default function CommentActionButton({ children, tone = "muted", onClick }: Props) {
    return (
        <button type="button" className={`text-xs font-medium ${toneClass[tone]}`} onClick={onClick}>
            {children}
        </button>
    );
}
