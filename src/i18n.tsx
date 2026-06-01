/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries } from "./i18n/dictionaries";
import type { Language } from "./i18n/types";

export type { Language } from "./i18n/types";

interface I18nValue {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function getInitialLanguage(): Language {
    const saved = localStorage.getItem("doublecode-language");
    if (saved === "ko" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = (next: Language) => {
        setLanguageState(next);
        localStorage.setItem("doublecode-language", next);
        document.documentElement.lang = next;
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo<I18nValue>(() => ({
        language,
        setLanguage,
        toggleLanguage: () => setLanguage(language === "ko" ? "en" : "ko"),
        t: (key) => dictionaries[language][key] ?? key,
    }), [language]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
    const value = useContext(I18nContext);
    if (!value) throw new Error("useI18n must be used inside I18nProvider");
    return value;
}
