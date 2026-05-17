import type { UseBarcodeReturn }   from "../../hooks/useBarcode";
import type { UseQRCodeReturn }    from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import BarcodePreviewPanel         from "./BarcodePreviewPanel";
import CombinedInput               from "./CombinedInput";
import QRPreviewPanel              from "./QRPreviewPanel";

interface Props {
    barcode:   UseBarcodeReturn;
    qr:        UseQRCodeReturn;
    input:     CombinedInputState;
    isInvalid: boolean;
}

export default function DesktopLayout({ barcode, qr, input, isInvalid }: Props) {
    return (
        <div className="hidden md:block mt-2">
            <div className="grid grid-cols-2 gap-20 xl:gap-28">
                <BarcodePreviewPanel barcode={barcode} input={input} />
                <QRPreviewPanel qr={qr} input={input} containerRef={qr.containerRefD} />
            </div>

            <div className="mx-auto mt-3 max-w-5xl">
                <CombinedInput {...input} isInvalid={isInvalid} />
            </div>
        </div>
    );
}
