import type { CSSProperties } from "react";
import type { Options } from "qr-code-styling";
import type { ColorConfig, QRState } from "../../types";

type QROptions = NonNullable<Options["qrOptions"]>;
type DotsOptions = NonNullable<Options["dotsOptions"]>;
type CornersSquareOptions = NonNullable<Options["cornersSquareOptions"]>;
type CornersDotOptions = NonNullable<Options["cornersDotOptions"]>;

function colorOrGradient(config: ColorConfig) {
    if (config.mode === "solid") {
        return { color: config.solid };
    }

    return {
        gradient: {
            type: config.gradient.type,
            rotation: config.gradient.rotation,
            colorStops: [
                { offset: 0, color: config.gradient.color1 },
                { offset: 1, color: config.gradient.color2 },
            ],
        },
    };
}

export function buildQRConfig(opts: QRState, data: string): Partial<Options> {
    const borderInset = getQRBorderInset(opts);

    return {
        type: "svg",
        width: opts.width,
        height: opts.height,
        margin: opts.margin + borderInset,
        data,
        qrOptions: {
            typeNumber: opts.typeNumber as QROptions["typeNumber"],
            mode: opts.mode as QROptions["mode"],
            errorCorrectionLevel: opts.errorCorrectionLevel as QROptions["errorCorrectionLevel"],
        },
        dotsOptions: {
            type: opts.dotStyle as DotsOptions["type"],
            ...colorOrGradient(opts.dotColor),
        },
        cornersSquareOptions: {
            type: opts.cornerSquareStyle as CornersSquareOptions["type"],
            ...colorOrGradient(opts.cornerSquareColor),
        },
        cornersDotOptions: {
            type: opts.cornerDotStyle as CornersDotOptions["type"],
            ...colorOrGradient(opts.cornerDotColor),
        },
        backgroundOptions: {
            color: opts.transparentBg || opts.border.enabled ? "transparent" : opts.backgroundColor,
        },
        ...(opts.image
            ? {
                  image: opts.image,
                  imageOptions: { crossOrigin: "anonymous", imageSize: opts.imageSize, margin: opts.imageMargin },
              }
            : {}),
    };
}

function getQRBorderInset(opts: QRState): number {
    if (!opts.border.enabled) return 0;

    const shortestSide = Math.min(opts.width, opts.height);
    const thickness = Math.min(opts.border.thickness, Math.max(0, Math.floor(shortestSide * 0.35)));
    const innerSize = Math.max(0, shortestSide - thickness * 2);
    const innerRadius = (innerSize / 2) * opts.border.round;
    const cornerSafeInset = Math.ceil(innerRadius * (1 - 1 / Math.SQRT2));

    return thickness + cornerSafeInset;
}

export function buildQRTextStyle(opts: QRState): CSSProperties {
    return {
        fontFamily: opts.font,
        fontWeight: opts.bold ? "bold" : "normal",
        fontStyle: opts.italic ? "italic" : "normal",
        fontSize: opts.fontSize,
        color: opts.textColor,
        textAlign: opts.textAlign,
        marginTop: opts.textPosition === "bottom" ? opts.textMargin : 0,
        marginBottom: opts.textPosition === "top" ? opts.textMargin : 0,
    };
}
