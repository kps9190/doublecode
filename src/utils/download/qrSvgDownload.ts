/**
 * QR코드 SVG 다운로드.
 * showText 가 켜져 있을 때는 QR Canvas 를 base64 <image> 로 임베드하고
 * <text> 엘리먼트를 추가한 SVG 파일을 생성한다.
 */
import type QRCodeStyling from "qr-code-styling";
import type { QRTextDownloadOpts } from "../../types";
import { blobToDownload } from "./triggerDownload";
import { getQRCanvas, getQRSVG } from "./qrPngDownload";
import { getQRDisplayText } from "../qrText";

type QRInstance = QRCodeStyling | null;

export function downloadQRSVG(
    containerEl: HTMLElement | null,
    qrInstance: QRInstance,
    opts: QRTextDownloadOpts,
    value: string,
    filename: string
): void {
    if (!opts.showText) {
        qrInstance?.download({ name: filename, extension: "svg" });
        return;
    }

    const qrImageData = getQRCanvas(containerEl)?.toDataURL("image/png") ?? serializeQRSVG(containerEl);
    if (!qrImageData) {
        qrInstance?.download({ name: filename, extension: "svg" });
        return;
    }

    const svg = buildCompositeSVG(qrImageData, opts, getQRDisplayText(opts, value));
    const blob = new Blob([svg], { type: "image/svg+xml" });
    blobToDownload(filename + ".svg", blob);
}

/** QR 이미지 + 텍스트를 하나의 SVG 문자열로 조합한다. */
function buildCompositeSVG(
    qrImageHref: string,
    opts: QRTextDownloadOpts,
    value: string
): string {
    const S    = opts.width;
    const fs   = opts.fontSize;
    const mg   = opts.textMargin;
    const lh   = fs * 1.4;
    const totalH = S + mg + lh;

    const fw     = opts.bold   ? "bold"   : "normal";
    const fi     = opts.italic ? "italic" : "normal";
    const anchor = resolveTextAnchor(opts.textAlign);
    const tx     = resolveTextX(opts.textAlign, S);

    const [imgY, textY] =
        opts.textPosition === "bottom"
            ? [0,      S + mg + fs]
            : [lh + mg, mg + fs];

    const bgRect = opts.transparentBg
        ? ""
        : `<rect width="${S}" height="${totalH}" fill="${opts.backgroundColor}"/>`;

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
        `     width="${S}" height="${totalH}">`,
        bgRect,
        `<image href="${qrImageHref}"`,
        `       x="0" y="${imgY}" width="${S}" height="${S}"/>`,
        `<text x="${tx}" y="${textY}"`,
        `      font-family="${opts.font}" font-size="${fs}"`,
        `      font-weight="${fw}" font-style="${fi}"`,
        `      fill="${opts.textColor}" text-anchor="${anchor}">${escapeXML(value || "")}</text>`,
        `</svg>`,
    ].join("\n");
}

function serializeQRSVG(containerEl: HTMLElement | null): string | null {
    const svg = getQRSVG(containerEl);
    if (!svg) return null;

    const xml = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
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
