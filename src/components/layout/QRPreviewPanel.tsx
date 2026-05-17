import type { RefObject } from "react";
import type { UseQRCodeReturn } from "../../hooks/useQRCode";
import type { CombinedInputState } from "../../hooks/useCombinedInput";
import { QRCard } from "../qrcode";
import DownloadButtons from "./DownloadButtons";
import ShowTextToggle from "./ShowTextToggle";

interface Props {
    qr: UseQRCodeReturn;
    input: CombinedInputState;
    containerRef: RefObject<HTMLDivElement | null>;
}

export default function QRPreviewPanel({ qr, input, containerRef }: Props) {
    return (
        <div className="space-y-4">
            <div className="relative flex min-h-[260px] w-full items-center justify-center md:min-h-[320px]">
                <QRCard
                    renderKey={qr.renderKey}
                    codeData={input.codeData}
                    opts={qr.opts}
                    containerRef={containerRef}
                    onReady={qr.setApi}
                    onWarning={qr.setWarning}
                    warning={qr.warning}
                />
            </div>
            <ShowTextToggle
                checked={qr.opts.showText}
                onChange={(showText) => qr.setOpts({ showText })}
            />
            <DownloadButtons
                canDownload={!!qr.api?.canDownload}
                onPng={() => qr.api?.downloadPNG()}
                onSvg={() => qr.api?.downloadSVG()}
            />
        </div>
    );
}
