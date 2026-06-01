/**
 * QR코드 SVG 다운로드.
 * showText 가 켜져 있을 때도 QR을 base64 이미지로 임베드하지 않고
 * 실제 SVG 노드와 <text> 엘리먼트를 합성한다.
 */
import type QRCodeStyling from "qr-code-styling";
import type { QRTextDownloadOpts } from "../../types";
import { blobToDownload } from "./triggerDownload";
import { getQRSVG } from "./qrPngDownload";
import { getQRDisplayText } from "../qrcode";

type QRInstance = QRCodeStyling | null;
interface SerializedQR {
    content: string;
    viewBoxWidth: number;
    viewBoxHeight: number;
}

class QRSVGTextComposer {
    constructor(
        private readonly qr: SerializedQR,
        private readonly opts: QRTextDownloadOpts,
        private readonly value: string
    ) {}

    build(): string {
        const W = this.opts.width;
        const H = this.opts.height;
        const fs = this.opts.fontSize;
        const mg = this.opts.textMargin;
        const lh = fs * 1.4;
        const totalH = H + mg + lh;
        const [imgY, textY] = this.resolveVerticalPositions(H, fs, mg, lh);

        return [
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
            `     width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}">`,
            this.backgroundRect(W, totalH),
            `<g transform="translate(0 ${imgY}) ${this.scaleTransform()}">`,
            this.qr.content,
            `</g>`,
            this.textElement(W, textY, fs),
            `</svg>`,
        ].join("\n");
    }

    private resolveVerticalPositions(H: number, fs: number, mg: number, lh: number): [number, number] {
        return this.opts.textPosition === "bottom"
            ? [0, H + mg + fs]
            : [lh + mg, mg + fs];
    }

    private backgroundRect(width: number, height: number): string {
        return this.opts.transparentBg
            ? ""
            : `<rect width="${width}" height="${height}" fill="${this.opts.backgroundColor}"/>`;
    }

    private scaleTransform(): string {
        // QR 내부 viewBox는 그대로 두고, 다운로드 설정 크기에 맞춰 바깥 그룹만 스케일한다.
        const scaleX = this.opts.width / this.qr.viewBoxWidth;
        const scaleY = this.opts.height / this.qr.viewBoxHeight;
        return `scale(${scaleX} ${scaleY})`;
    }

    private textElement(svgWidth: number, y: number, fontSize: number): string {
        const fontWeight = this.opts.bold ? "bold" : "normal";
        const fontStyle = this.opts.italic ? "italic" : "normal";

        return [
            `<text x="${resolveTextX(this.opts.textAlign, svgWidth)}" y="${y}"`,
            `      font-family="${escapeXML(this.opts.font)}" font-size="${fontSize}"`,
            `      font-weight="${fontWeight}" font-style="${fontStyle}"`,
            `      fill="${this.opts.textColor}" text-anchor="${resolveTextAnchor(this.opts.textAlign)}">${escapeXML(this.value || "")}</text>`,
        ].join("\n");
    }
}

export function downloadQRSVG(
    containerEl: HTMLElement | null,
    qrInstance: QRInstance,
    opts: QRTextDownloadOpts,
    value: string,
    filename: string
): void {
    if (!opts.showText) {
        // 라이브러리 기본 download()는 일부 앱에서 깨지는 clip-path URL을 만든다.
        const svg = serializeQRSVGMarkup(containerEl, opts);
        if (svg) {
            blobToDownload(filename + ".svg", new Blob([svg], { type: "image/svg+xml" }));
            return;
        }

        qrInstance?.download({ name: filename, extension: "svg" });
        return;
    }

    // Affinity/Pixelmator는 SVG 안의 data:image를 무시할 수 있어 벡터 노드를 직접 합성한다.
    const qr = serializeQRSVGContent(containerEl);
    if (!qr) {
        qrInstance?.download({ name: filename, extension: "svg" });
        return;
    }

    const svg = new QRSVGTextComposer(qr, opts, getQRDisplayText(opts, value)).build();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    blobToDownload(filename + ".svg", blob);
}

function serializeQRSVGMarkup(containerEl: HTMLElement | null, opts: QRTextDownloadOpts): string | null {
    const svg = getQRSVG(containerEl);
    if (!svg) return null;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    ensureViewBox(clone, svg);

    // 화면 렌더 크기가 플러그인에 의해 커져도 다운로드 크기는 사용자 설정값을 따른다.
    clone.setAttribute("width", String(opts.width));
    clone.setAttribute("height", String(opts.height));

    const xml = new XMLSerializer().serializeToString(clone);
    return `<?xml version="1.0" standalone="no"?>\n${normalizeSVGRefs(xml)}`;
}

function serializeQRSVGContent(containerEl: HTMLElement | null): SerializedQR | null {
    const svg = getQRSVG(containerEl);
    if (!svg) return null;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    ensureViewBox(clone, svg);

    const { width, height } = getViewBoxSize(clone);
    const content = Array.from(clone.childNodes)
        .map((node) => new XMLSerializer().serializeToString(node))
        .join("\n");

    return {
        content: normalizeSVGRefs(content),
        viewBoxWidth: width,
        viewBoxHeight: height,
    };
}

function normalizeSVGRefs(xml: string): string {
    // url('#id')는 일부 SVG 편집기에서 실패하므로 표준적인 url(#id) 형태로 저장한다.
    return xml.replace(/url\(['"]#([^'")]+)['"]\)/g, "url(#$1)");
}

function ensureViewBox(clone: SVGSVGElement, source: SVGSVGElement): void {
    if (clone.getAttribute("viewBox")) return;

    // qr-code-styling 출력은 width/height만 있고 viewBox가 없는 경우가 있다.
    const width = source.getAttribute("width") || String(source.viewBox.baseVal.width);
    const height = source.getAttribute("height") || String(source.viewBox.baseVal.height);
    clone.setAttribute("viewBox", `0 0 ${parseSvgNumber(width)} ${parseSvgNumber(height)}`);
}

function parseSvgNumber(value: string): number {
    return Number.parseFloat(value) || 0;
}

function getViewBoxSize(svg: SVGSVGElement): { width: number; height: number } {
    const viewBox = svg.getAttribute("viewBox")?.trim().split(/\s+/).map(Number);
    if (viewBox && viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
        return { width: viewBox[2], height: viewBox[3] };
    }

    return {
        width: parseSvgNumber(svg.getAttribute("width") || ""),
        height: parseSvgNumber(svg.getAttribute("height") || ""),
    };
}

/* ── 내부 헬퍼 ─────────────────────────────────────────────── */

function resolveTextAnchor(align: string): string {
    if (align === "left")  return "start";
    if (align === "right") return "end";
    return "middle";
}

function resolveTextX(align: string, svgWidth: number): number {
    if (align === "left")  return 0;
    if (align === "right") return svgWidth;
    return svgWidth / 2;
}

function escapeXML(s: string): string {
    return s
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&apos;");
}
