import { FeedbackComments } from "../comments";

const GITHUB_REPOSITORY_URL = "https://github.com/kps9190/doublecode";

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
            <FeedbackComments />
            <p className="mt-10 border-t border-slate-200 pt-6 text-center text-xs uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:text-slate-700">
                <a
                    href={GITHUB_REPOSITORY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-slate-700 dark:hover:text-slate-400"
                >
                    GitHub: DoubleCode
                </a>
                <span> · doublecode.net</span>
            </p>
        </footer>
    );
}
