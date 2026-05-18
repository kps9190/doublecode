import type QRCodeStyling from "qr-code-styling";
import type { QRState } from "../../types";
import { DownloadNameBuilder } from "./DownloadNameBuilder";
import { downloadQRPNG } from "./qrPngDownload";
import { downloadQRSVG } from "./qrSvgDownload";

export class QRDownloadService {
    constructor(
        private readonly containerEl: HTMLElement | null,
        private readonly qrInstance: QRCodeStyling | null,
        private readonly opts: QRState,
        private readonly codeData: string
    ) {}

    downloadPNG(): void {
        downloadQRPNG(this.containerEl, this.opts, this.codeData, this.filename());
    }

    downloadSVG(): void {
        downloadQRSVG(this.containerEl, this.qrInstance, this.opts, this.codeData, this.filename());
    }

    private filename(): string {
        return new DownloadNameBuilder("qr", this.codeData)
            .withOptions([
                this.opts.errorCorrectionLevel,
                this.opts.mode,
                this.opts.width,
                this.opts.height,
                this.opts.margin,
                this.opts.dotStyle,
                this.opts.cornerSquareStyle,
                this.opts.cornerDotStyle,
                this.opts.showText,
                this.opts.textPosition,
                this.opts.transparentBg,
            ])
            .build();
    }
}
