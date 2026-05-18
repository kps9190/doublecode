import type { TouchEventHandler }   from "react";
import type { UseBarcodeReturn }   from "../../hooks/useBarcode";
import type { UseQRCodeReturn }    from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import { BarcodeOptions }          from "../barcode";
import { QROptions }               from "../qrcode";
import BarcodePreviewPanel         from "./BarcodePreviewPanel";
import CombinedInput               from "./CombinedInput";
import QRPreviewPanel              from "./QRPreviewPanel";

const MOBILE_PANEL_CLASS = "space-y-6";

interface PreviewSwipeHandlers {
    onTouchStart: TouchEventHandler<HTMLDivElement>;
    onTouchEnd: TouchEventHandler<HTMLDivElement>;
}

interface BarcodeSlideProps {
    barcode: UseBarcodeReturn;
    input: CombinedInputState;
    isInvalid: boolean;
    previewSwipeHandlers: PreviewSwipeHandlers;
}

interface QRSlideProps {
    qr: UseQRCodeReturn;
    input: CombinedInputState;
    isInvalid: boolean;
    previewSwipeHandlers: PreviewSwipeHandlers;
}

export function BarcodeMobileSlide({ barcode, input, isInvalid, previewSwipeHandlers }: BarcodeSlideProps) {
    return (
        <div className={MOBILE_PANEL_CLASS}>
            <BarcodePreviewPanel barcode={barcode} input={input} previewSwipeHandlers={previewSwipeHandlers} />
            <CombinedInput {...input} isInvalid={isInvalid} />
            <BarcodeOptions opts={barcode.opts} onChange={barcode.setOpts} />
        </div>
    );
}

export function QRMobileSlide({ qr, input, isInvalid, previewSwipeHandlers }: QRSlideProps) {
    return (
        <div className={MOBILE_PANEL_CLASS}>
            <QRPreviewPanel qr={qr} input={input} containerRef={qr.containerRefM} previewSwipeHandlers={previewSwipeHandlers} />
            <CombinedInput {...input} isInvalid={isInvalid} />
            <QROptions
                opts={qr.opts}
                onChange={qr.setOpts}
                onForceRecreate={qr.forceRecreate}
            />
        </div>
    );
}
