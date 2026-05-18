import type { BarcodeState } from "../../types";
import { DownloadNameBuilder } from "./DownloadNameBuilder";
import { serializeSVG, downloadAsSVG, downloadAsPNG } from "./svgDownload";

export class BarcodeDownloadService {
    constructor(
        private readonly svg: SVGSVGElement,
        private readonly opts: BarcodeState,
        private readonly codeData: string
    ) {}

    downloadSVG(): void {
        downloadAsSVG(this.filename("svg"), serializeSVG(this.svg).xml);
    }

    downloadPNG(scale = 3): void {
        const background = this.opts.transparentBg ? "transparent" : this.opts.background;
        downloadAsPNG(this.filename("png"), serializeSVG(this.svg), background, scale);
    }

    private filename(extension: string): string {
        const label = this.opts.useTextOverride && this.opts.textOverride.trim()
            ? this.opts.textOverride
            : this.codeData;

        return new DownloadNameBuilder("barcode", label)
            .withOptions([
                this.opts.format,
                this.opts.width,
                this.opts.height,
                this.opts.margin,
                this.opts.displayValue,
                this.opts.textPosition,
                this.opts.textAlign,
                this.opts.transparentBg,
            ])
            .withExtension(extension)
            .build();
    }
}
