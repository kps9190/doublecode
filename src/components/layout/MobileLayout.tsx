import { useRef, type TouchEvent } from "react";
import type { UseBarcodeReturn }   from "../../hooks/useBarcode";
import type { UseQRCodeReturn }    from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import type { MobileCodeView }     from "../../types";
import { BarcodeMobileSlide, QRMobileSlide } from "./MobileCodeSlide";

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
    const touchStartY = useRef(0);
    const activeIndex = activeView === "barcode" ? 0 : 1;
    const isBarcodeActive = activeView === "barcode";

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? 0;
        touchStartY.current = event.changedTouches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
        const distanceX = touchEndX - touchStartX.current;
        const distanceY = touchEndY - touchStartY.current;

        if (Math.abs(distanceX) <= Math.abs(distanceY)) return;

        if (distanceX < -SWIPE_THRESHOLD) onViewChange("qr");
        if (distanceX > SWIPE_THRESHOLD) onViewChange("barcode");
    };

    const previewSwipeHandlers = {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
    };

    return (
        <div className="md:hidden space-y-3 mt-2">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {/* 각 슬라이드 안에 미리보기, 입력, 설정을 함께 둬야 전체 화면이 같이 스와이프된다. */}
                    <div className="w-full shrink-0">
                        {isBarcodeActive && (
                            <BarcodeMobileSlide
                                barcode={barcode}
                                input={input}
                                isInvalid={isInvalid}
                                previewSwipeHandlers={previewSwipeHandlers}
                            />
                        )}
                    </div>
                    <div className="w-full shrink-0">
                        {!isBarcodeActive && (
                            <QRMobileSlide
                                qr={qr}
                                input={input}
                                isInvalid={isInvalid}
                                previewSwipeHandlers={previewSwipeHandlers}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
