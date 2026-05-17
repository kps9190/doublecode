import { useRef, type TouchEvent } from "react";
import type { UseBarcodeReturn }   from "../../hooks/useBarcode";
import type { UseQRCodeReturn }    from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import type { MobileCodeView }     from "../../types";
import BarcodePreviewPanel         from "./BarcodePreviewPanel";
import CombinedInput               from "./CombinedInput";
import QRPreviewPanel              from "./QRPreviewPanel";

interface Props {
    barcode:   UseBarcodeReturn;
    qr:        UseQRCodeReturn;
    input:     CombinedInputState;
    isInvalid: boolean;
    activeView: MobileCodeView;
    onViewChange: (view: MobileCodeView) => void;
}

const SWIPE_THRESHOLD = 48;

export default function MobileLayout({ barcode, qr, input, isInvalid, activeView, onViewChange }: Props) {
    const touchStartX = useRef(0);
    const activeIndex = activeView === "barcode" ? 0 : 1;
    const isBarcodeActive = activeView === "barcode";
    const inactivePanelClass = "h-0 overflow-hidden";

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = touchEndX - touchStartX.current;

        if (distance < -SWIPE_THRESHOLD) onViewChange("qr");
        if (distance > SWIPE_THRESHOLD) onViewChange("barcode");
    };

    return (
        <div
            className="md:hidden space-y-3 mt-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    <div className={`w-full shrink-0 ${isBarcodeActive ? "" : inactivePanelClass}`} aria-hidden={!isBarcodeActive}>
                        <BarcodePreviewPanel barcode={barcode} input={input} />
                    </div>
                    <div className={`w-full shrink-0 ${isBarcodeActive ? inactivePanelClass : ""}`} aria-hidden={isBarcodeActive}>
                        <QRPreviewPanel qr={qr} input={input} containerRef={qr.containerRefM} />
                    </div>
                </div>
            </div>
            <CombinedInput {...input} isInvalid={isInvalid} />
        </div>
    );
}
