import type { TouchEventHandler } from "react";
import type { UseBarcodeReturn } from "../../hooks/useBarcode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import { BarcodePreview } from "../barcode";
import DownloadButtons from "./DownloadButtons";
import ShowTextToggle from "./ShowTextToggle";

interface Props {
    barcode: UseBarcodeReturn;
    input: CombinedInputState;
    previewSwipeHandlers?: {
        onTouchStart: TouchEventHandler<HTMLDivElement>;
        onTouchEnd: TouchEventHandler<HTMLDivElement>;
    };
}

export default function BarcodePreviewPanel({ barcode, input, previewSwipeHandlers }: Props) {
    const isInputEmpty = !input.codeData.trim();
    const disableShowText = isInputEmpty || !!barcode.error;

    return (
        <div className="space-y-4">
            <div
                className="flex min-h-[120px] items-center justify-center md:min-h-[320px]"
                {...previewSwipeHandlers}
            >
                <BarcodePreview
                    codeData={input.codeData}
                    opts={barcode.opts}
                    onErrorChange={barcode.setError}
                    onReady={barcode.setApi}
                />
            </div>
            <ShowTextToggle
                checked={barcode.opts.displayValue}
                disabled={disableShowText}
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
