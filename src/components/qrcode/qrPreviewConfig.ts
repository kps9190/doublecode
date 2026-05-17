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
    return {
        type: "svg",
        width: opts.width,
        height: opts.height,
        margin: opts.margin,
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
            color: opts.transparentBg ? "transparent" : opts.backgroundColor,
        },
        ...(opts.image
            ? {
                  image: opts.image,
                  imageOptions: { crossOrigin: "anonymous", imageSize: opts.imageSize, margin: opts.imageMargin },
              }
            : {}),
    };
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
