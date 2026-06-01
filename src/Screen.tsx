import { useState } from "react";
import { useCombinedInput, useBarcode, useQRCode, useSystemTheme } from "./hooks";
import { Header, MobileLayout, DesktopLayout, Footer } from "./components/layout";
import { BarcodeOptions }                          from "./components/barcode";
import { QROptions }                               from "./components/qrcode";
import type { MobileCodeView }                     from "./types";
import { I18nProvider }                            from "./i18n";

export default function Screen() {
    const { dark, toggleDark } = useSystemTheme();

    return (
        <I18nProvider>
            <ScreenContent dark={dark} onToggleDark={toggleDark} />
        </I18nProvider>
    );
}

interface ScreenContentProps { dark: boolean; onToggleDark: () => void }

/**
 * 메인 화면 오케스트레이터.
 * Header/Footer는 고정 영역으로 두고, 모바일에서는 MobileLayout 내부만 스와이프된다.
 * 데스크톱에서는 미리보기와 설정 패널을 각각 2열로 유지한다.
 */
function ScreenContent({ dark, onToggleDark }: ScreenContentProps) {
    const input   = useCombinedInput("123456789");
    const barcode = useBarcode();
    const qr      = useQRCode();
    const [mobileView, setMobileView] = useState<MobileCodeView>("qr");
    const isInvalid = !!barcode.error || !!qr.warning;

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-100">
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

                <div className="hidden md:grid grid-cols-2 gap-8 mt-8">
                    <BarcodeOptions opts={barcode.opts} onChange={barcode.setOpts} />
                    <QROptions
                        opts={qr.opts}
                        onChange={qr.setOpts}
                        onForceRecreate={qr.forceRecreate}
                    />
                </div>

                <Footer />
            </div>
        </div>
    );
}
