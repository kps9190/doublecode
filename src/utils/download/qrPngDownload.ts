/**
 * QR코드 PNG 다운로드.
 * qr-code-styling 은 QR 이미지만 저장하므로,
 * showText 가 켜져 있을 때는 Canvas 에 글자를 직접 합성한다.
 */
import type { QRTextDownloadOpts } from "../../types";
import { blobToDownload } from "./triggerDownload";
import { getQRDisplayText } from "../qrText";

export function downloadQRPNG(
    containerEl: HTMLElement | null,
    opts: QRTextDownloadOpts,
    value: string,
    filename: string
): void {
    const qrCanvas = getQRCanvas(containerEl);
    if (qrCanvas) {
        downloadCanvasAsPNG(qrCanvas, opts, value, filename);
        return;
    }

    makeCanvasFromQRSVG(containerEl)
        .then((canvas) => {
            if (canvas) downloadCanvasAsPNG(canvas, opts, value, filename);
        })
        .catch(() => undefined);
}

function downloadCanvasAsPNG(
    qrCanvas: HTMLCanvasElement,
    opts: QRTextDownloadOpts,
    value: string,
    filename: string
): void {
    if (!opts.showText) {
        qrCanvas.toBlob((blob) => {
            if (blob) blobToDownload(filename + ".png", blob);
        }, "image/png");
        return;
    }

    compositeQRWithText(qrCanvas, opts, getQRDisplayText(opts, value), filename);
}

/** QR Canvas 위에 텍스트를 합성해 새 Canvas 로 내보낸다 (2× 해상도). */
function compositeQRWithText(
    qrCanvas: HTMLCanvasElement,
    opts: QRTextDownloadOpts,
    value: string,
    filename: string
): void {
    const SCALE = 2;
    const qrPx  = opts.width  * SCALE;
    const fsPx  = opts.fontSize * SCALE;
    const mgPx  = opts.textMargin * SCALE;
    const fontStr = buildFontString(opts, fsPx);

    // 텍스트 너비 측정
    const tmp  = document.createElement("canvas");
    const tctx = tmp.getContext("2d")!;
    tctx.font  = fontStr;
    const textW = tctx.measureText(value || "").width;

    const lineH   = fsPx * 1.4;
    const canvasW = Math.max(qrPx, textW + 20 * SCALE);
    const canvasH = qrPx + mgPx + lineH;
    const qrX     = (canvasW - qrPx) / 2;
    const textX   = resolveTextX(opts.textAlign, canvasW, SCALE);

    const out = document.createElement("canvas");
    out.width  = canvasW;
    out.height = canvasH;
    const ctx = out.getContext("2d")!;

    // 배경
    if (!opts.transparentBg) {
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // QR + 텍스트 배치
    ctx.font         = fontStr;
    ctx.fillStyle    = opts.textColor;
    ctx.textAlign    = toCanvasTextAlign(opts.textAlign);
    ctx.textBaseline = "top";

    if (opts.textPosition === "bottom") {
        ctx.drawImage(qrCanvas, qrX, 0, qrPx, qrPx);
        ctx.fillText(value || "", textX, qrPx + mgPx, canvasW - 20 * SCALE);
    } else {
        ctx.fillText(value || "", textX, mgPx, canvasW - 20 * SCALE);
        ctx.drawImage(qrCanvas, qrX, lineH + mgPx, qrPx, qrPx);
    }

    out.toBlob(
        (blob) => { if (blob) blobToDownload(filename + ".png", blob); },
        "image/png"
    );
}

/* ── 내부 헬퍼 ─────────────────────────────────────────────── */

export function getQRCanvas(containerEl: HTMLElement | null): HTMLCanvasElement | null {
    return containerEl?.querySelector("canvas") ?? null;
}

export function getQRSVG(containerEl: HTMLElement | null): SVGSVGElement | null {
    return containerEl?.querySelector("svg") ?? null;
}

function makeCanvasFromQRSVG(containerEl: HTMLElement | null): Promise<HTMLCanvasElement | null> {
    const svg = getQRSVG(containerEl);
    if (!svg) return Promise.resolve(null);

    const xml = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const canvas = document.createElement("canvas");
    canvas.width = Number(svg.getAttribute("width")) || svg.viewBox.baseVal.width;
    canvas.height = Number(svg.getAttribute("height")) || svg.viewBox.baseVal.height;

    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
        image.onload = () => {
            canvas.getContext("2d")?.drawImage(image, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas);
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("QR SVG 이미지를 PNG로 변환할 수 없습니다."));
        };
        image.src = url;
    });
}

function buildFontString(opts: QRTextDownloadOpts, fsPx: number): string {
    return [
        opts.italic ? "italic" : "",
        opts.bold   ? "bold"   : "",
        `${fsPx}px`,
        opts.font,
    ].filter(Boolean).join(" ");
}

function toCanvasTextAlign(align: string): CanvasTextAlign {
    if (align === "left")  return "left";
    if (align === "right") return "right";
    return "center";
}

function resolveTextX(align: string, canvasW: number, scale: number): number {
    if (align === "left")  return 10 * scale;
    if (align === "right") return canvasW - 10 * scale;
    return canvasW / 2;
}
