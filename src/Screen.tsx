import { useEffect, useState } from "react";
import { useCombinedInput, useBarcode, useQRCode } from "./hooks";
import { Header, MobileLayout, DesktopLayout }     from "./components/layout";
import { BarcodeOptions }                          from "./components/barcode";
import { QROptions }                               from "./components/qrcode";
import type { MobileCodeView }                     from "./types";
import { I18nProvider, useI18n }                   from "./i18n";

export default function Screen() {
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
            <ScreenContent dark={dark} onToggleDark={() => setDark((d) => !d)} />
        </I18nProvider>
    );
}

interface ScreenContentProps { dark: boolean; onToggleDark: () => void }

/**
 * 메인 화면 오케스트레이터.
 * - max-w-5xl mx-auto 로 doublecode.net 과 동일한 측면 여백
 * - 설정 패널 2열 gap-8 로 충분한 간격
 * - QR 테두리 설정은 QROptions 안에 통합
 */
function ScreenContent({ dark, onToggleDark }: ScreenContentProps) {
    const { t } = useI18n();
    const input   = useCombinedInput("123456789");
    const barcode = useBarcode();
    const qr      = useQRCode();
    const [mobileView, setMobileView] = useState<MobileCodeView>("qr");
    const isInvalid = !!barcode.error || !!qr.warning;

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-100">
            {/* 최대 너비 + 측면 여백 */}
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pb-12">
                <Header
                    dark={dark}
                    activeMobileView={mobileView}
                    onMobileViewChange={setMobileView}
                    onToggle={onToggleDark}
                />

                <MobileLayout
                    barcode={barcode}
                    qr={qr}
                    input={input}
                    isInvalid={isInvalid}
                    activeView={mobileView}
                    onViewChange={setMobileView}
                />
                <DesktopLayout barcode={barcode} qr={qr} input={input} isInvalid={isInvalid} />

                <div className="mt-8 lg:hidden">
                    {mobileView === "barcode" ? (
                        <BarcodeOptions opts={barcode.opts} onChange={barcode.setOpts} />
                    ) : (
                        <QROptions
                            opts={qr.opts}
                            onChange={qr.setOpts}
                            onForceRecreate={qr.forceRecreate}
                        />
                    )}
                </div>

                <div className="hidden lg:grid grid-cols-2 gap-8 mt-8">
                    <BarcodeOptions opts={barcode.opts} onChange={barcode.setOpts} />
                    <QROptions
                        opts={qr.opts}
                        onChange={qr.setOpts}
                        onForceRecreate={qr.forceRecreate}
                    />
                </div>

                <p className="text-center text-xs text-slate-500 dark:text-slate-700 mt-10 tracking-widest uppercase">
                    {t("app.footer")}
                </p>
            </div>
        </div>
    );
}
