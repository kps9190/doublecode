import type { UseBarcodeReturn } from "../../hooks/useBarcode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import { BarcodePreview } from "../barcode";
import DownloadButtons from "./DownloadButtons";
import ShowTextToggle from "./ShowTextToggle";

interface Props {
    barcode: UseBarcodeReturn;
    input: CombinedInputState;
}

export default function BarcodePreviewPanel({ barcode, input }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex min-h-[180px] items-center justify-center md:min-h-[320px]">
                <BarcodePreview
                    codeData={input.codeData}
                    opts={barcode.opts}
                    onErrorChange={barcode.setError}
                    onReady={barcode.setApi}
                />
            </div>
            <ShowTextToggle
                checked={barcode.opts.displayValue}
                onChange={(displayValue) => barcode.setOpts({ displayValue })}
            />
            <DownloadButtons
                canDownload={!!barcode.api?.canDownload}
                onPng={() => barcode.api?.downloadPNG(3)}
                onSvg={() => barcode.api?.downloadSVG()}
            />
        </div>
    );
}
