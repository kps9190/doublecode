import { useEffect, useState } from "react";
import Screen from "./Screen";
import { I18nProvider } from "./i18n";

export default function App() {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("doublecode-theme");
        return saved ? saved === "dark" : true;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.style.colorScheme = dark ? "dark" : "light";
        document.documentElement.style.backgroundColor = dark ? "#0f172a" : "#f8fafc";
        localStorage.setItem("doublecode-theme", dark ? "dark" : "light");
    }, [dark]);

    useEffect(() => {
        const mobileHost = "m.doublecode.net";
        const desktopHosts = new Set(["doublecode.net", "www.doublecode.net"]);
        const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
        const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

        if (!desktopHosts.has(window.location.hostname)) return;
        if (!isMobileViewport && !isMobileAgent) return;

        window.location.replace(
            `https://${mobileHost}${window.location.pathname}${window.location.search}${window.location.hash}`
        );
    }, []);

    return (
        <I18nProvider>
            <Screen dark={dark} onToggleDark={() => setDark((d) => !d)} />
        </I18nProvider>
    );
}
