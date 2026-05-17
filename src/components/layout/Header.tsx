import type { ReactNode } from "react";
import type { MobileCodeView } from "../../types";
import { useI18n } from "../../i18n";

interface Props {
    dark: boolean;
    activeMobileView: MobileCodeView;
    onToggle: () => void;
}

export default function Header({ dark, activeMobileView, onToggle }: Props) {
    const { t, toggleLanguage } = useI18n();

    return (
        <header className="text-center pt-10 pb-8 relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {t("app.title")}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-500 dark:text-slate-400 mt-5">
                {t("app.subtitle")}
            </p>
            <div className="mt-5 flex justify-center md:hidden">
                <div className="relative flex items-center gap-8 rounded-2xl border border-slate-200 bg-white/80 px-7 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
                    <MobileViewIcon active={activeMobileView === "barcode"} label={t("mobile.barcode")}>
                        <BarcodeIcon />
                    </MobileViewIcon>
                    <MobileViewIcon active={activeMobileView === "qr"} label={t("mobile.qr")}>
                        <QRIcon />
                    </MobileViewIcon>
                </div>
            </div>
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <button
                    type="button"
                    onClick={toggleLanguage}
                    className="h-10 rounded-full border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    {t("language.toggle")}
                </button>
                <button type="button" onClick={onToggle} title={dark ? t("theme.light") : t("theme.dark")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    {dark ? "☀️" : "🌙"}
                </button>
            </div>
        </header>
    );
}

function MobileViewIcon({
    active,
    children,
    label,
}: {
    active: boolean;
    children: ReactNode;
    label: string;
}) {
    return (
        <div
            aria-label={label}
            className={`flex h-12 w-16 items-center justify-center rounded-xl transition-colors ${
                active ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 dark:text-slate-500"
            }`}
        >
            {children}
        </div>
    );
}

function BarcodeIcon() {
    return (
        <svg viewBox="0 0 40 28" className="h-8 w-10" role="img" aria-hidden="true">
            <rect x="3" y="4" width="34" height="20" rx="2" fill="currentColor" opacity="0.14" />
            <path d="M7 7h2v14H7zm4 0h1v14h-1zm4 0h3v14h-3zm5 0h1v14h-1zm4 0h2v14h-2zm5 0h1v14h-1zm3 0h2v14h-2z" fill="currentColor" />
        </svg>
    );
}

function QRIcon() {
    return (
        <svg viewBox="0 0 32 32" className="h-8 w-8" role="img" aria-hidden="true">
            <path d="M4 4h10v10H4zm3 3v4h4V7zm11-3h10v10H18zm3 3v4h4V7zM4 18h10v10H4zm3 3v4h4v-4zm13-2h3v3h-3zm5 0h3v3h-3zm-7 5h3v4h-3zm5-1h5v2h-3v3h-2z" fill="currentColor" />
        </svg>
    );
}
