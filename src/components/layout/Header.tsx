import type { ReactNode } from "react";
import type { MobileCodeView } from "../../types";
import { useI18n } from "../../i18n";

interface Props {
    dark: boolean;
    activeMobileView: MobileCodeView;
    onMobileViewChange: (view: MobileCodeView) => void;
    onToggle: () => void;
}

export default function Header({ dark, activeMobileView, onMobileViewChange, onToggle }: Props) {
    const { language, t, toggleLanguage } = useI18n();

    return (
        <header className="relative pt-5 pb-6 text-center sm:pt-7">
            <div>
                <div className="min-w-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                        {t("app.title")}
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-500 dark:text-slate-400 mt-4">
                        {t("app.subtitle")}
                    </p>
                </div>
                <HeaderActions
                    dark={dark}
                    languageLabel={language === "ko" ? "EN" : "KO"}
                    languageTitle={t("language.toggle")}
                    themeTitle={dark ? t("theme.light") : t("theme.dark")}
                    onToggleLanguage={toggleLanguage}
                    onToggleTheme={onToggle}
                    className="absolute right-0 top-5 hidden md:inline-flex sm:top-7"
                />
            </div>
            <div className="mx-auto mt-7 flex w-full items-center gap-3 md:hidden">
                <div className="grid min-w-0 flex-1 grid-cols-2 border-b border-slate-300 dark:border-slate-700">
                    <MobileViewIcon active={activeMobileView === "barcode"} label={t("mobile.barcode")} onClick={() => onMobileViewChange("barcode")}>
                        <BarcodeIcon />
                    </MobileViewIcon>
                    <MobileViewIcon active={activeMobileView === "qr"} label={t("mobile.qr")} onClick={() => onMobileViewChange("qr")}>
                        <QRIcon />
                    </MobileViewIcon>
                </div>
                <HeaderActions
                    dark={dark}
                    languageLabel={language === "ko" ? "EN" : "KO"}
                    languageTitle={t("language.toggle")}
                    themeTitle={dark ? t("theme.light") : t("theme.dark")}
                    onToggleLanguage={toggleLanguage}
                    onToggleTheme={onToggle}
                    className="inline-flex shrink-0"
                    vertical
                />
            </div>
        </header>
    );
}

function HeaderActions({
    dark,
    languageLabel,
    languageTitle,
    themeTitle,
    onToggleLanguage,
    onToggleTheme,
    className = "inline-flex",
    vertical = false,
}: {
    dark: boolean;
    languageLabel: string;
    languageTitle: string;
    themeTitle: string;
    onToggleLanguage: () => void;
    onToggleTheme: () => void;
    className?: string;
    vertical?: boolean;
}) {
    const actionClass = "h-9 rounded-full text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700";

    return (
        <div className={`${className} ${vertical ? "flex-col" : ""} items-center rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80`}>
            <button
                type="button"
                onClick={onToggleLanguage}
                aria-label={languageTitle}
                title={languageTitle}
                className={`${actionClass} ${vertical ? "w-12 px-0" : "px-3"} text-sm font-bold tracking-wide`}
            >
                {languageLabel}
            </button>
            <div className={`${vertical ? "my-1 h-px w-6" : "mx-1 h-5 w-px"} bg-slate-200 dark:bg-slate-700`} />
            <button
                type="button"
                onClick={onToggleTheme}
                title={themeTitle}
                aria-label={themeTitle}
                className={`${actionClass} flex ${vertical ? "w-12" : "w-9"} items-center justify-center`}
            >
                {dark ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
    );
}

function MobileViewIcon({
    active,
    children,
    label,
    onClick,
}: {
    active: boolean;
    children: ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`relative flex h-14 items-center justify-center transition-colors after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:mx-auto after:transition-all ${
                active
                    ? "text-blue-600 after:h-1 after:w-full after:rounded-t-full after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400"
                    : "text-slate-400 after:h-px after:w-full after:bg-slate-300 hover:text-slate-600 dark:text-slate-600 dark:after:bg-slate-700 dark:hover:text-slate-400"
            }`}
        >
            {children}
        </button>
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

function SunIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M20.5 14.2A7.7 7.7 0 0 1 9.8 3.5 8.8 8.8 0 1 0 20.5 14.2Z" fill="currentColor" />
        </svg>
    );
}
