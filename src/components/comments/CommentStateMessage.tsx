interface Props {
    children: string;
    tone?: "neutral" | "warning";
}

const toneClass = {
    neutral: "text-slate-500 dark:text-slate-400",
    warning: "text-amber-700 dark:text-amber-300",
} as const;

export default function CommentStateMessage({ children, tone = "neutral" }: Props) {
    return (
        <p className={`rounded-lg border border-slate-200 px-4 py-5 text-center text-sm dark:border-slate-800 ${toneClass[tone]}`}>
            {children}
        </p>
    );
}
