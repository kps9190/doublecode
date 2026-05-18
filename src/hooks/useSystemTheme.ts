import { useEffect, useState } from "react";

const DARK_BG = "#0f172a";
const LIGHT_BG = "#f8fafc";
const THEME_QUERY = "(prefers-color-scheme: dark)";

export function useSystemTheme() {
    const [dark, setDark] = useState(() => window.matchMedia(THEME_QUERY).matches);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.style.colorScheme = dark ? "dark" : "light";
        document.documentElement.style.backgroundColor = dark ? DARK_BG : LIGHT_BG;
    }, [dark]);

    useEffect(() => {
        // 시스템 테마 변경을 열린 화면에 즉시 반영한다.
        const media = window.matchMedia(THEME_QUERY);
        const syncTheme = (event: MediaQueryListEvent) => setDark(event.matches);

        media.addEventListener("change", syncTheme);
        return () => media.removeEventListener("change", syncTheme);
    }, []);

    return {
        dark,
        toggleDark: () => setDark((current) => !current),
    };
}
