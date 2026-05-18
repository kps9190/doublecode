import type { UseBarcodeReturn }   from "../../hooks/useBarcode";
import type { UseQRCodeReturn }    from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import { BarcodeOptions }          from "../barcode";
import { QROptions }               from "../qrcode";
import BarcodePreviewPanel         from "./BarcodePreviewPanel";
import CombinedInput               from "./CombinedInput";
import QRPreviewPanel              from "./QRPreviewPanel";

const MOBILE_PANEL_CLASS = "space-y-6";

interface BarcodeSlideProps {
    barcode: UseBarcodeReturn;
    input: CombinedInputState;
    isInvalid: boolean;
}

interface QRSlideProps {
    qr: UseQRCodeReturn;
    input: CombinedInputState;
    isInvalid: boolean;
}

export function BarcodeMobileSlide({ barcode, input, isInvalid }: BarcodeSlideProps) {
    return (
        <div className={MOBILE_PANEL_CLASS}>
            <BarcodePreviewPanel barcode={barcode} input={input} />
            <CombinedInput {...input} isInvalid={isInvalid} />
            <BarcodeOptions opts={barcode.opts} onChange={barcode.setOpts} />
        </div>
    );
}

export function QRMobileSlide({ qr, input, isInvalid }: QRSlideProps) {
    return (
        <div className={MOBILE_PANEL_CLASS}>
            <QRPreviewPanel qr={qr} input={input} containerRef={qr.containerRefM} />
            <CombinedInput {...input} isInvalid={isInvalid} />
            <QROptions
                opts={qr.opts}
                onChange={qr.setOpts}
                onForceRecreate={qr.forceRecreate}
            />
        </div>
    );
}
