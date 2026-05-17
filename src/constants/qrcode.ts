import type { QRState, ColorConfig, DecorationSide } from "../types";

export const QR_DOT_STYLES = [
    { value: "square",         labelKey: "shape.square" },
    { value: "dots",           labelKey: "shape.dot" },
    { value: "rounded",        labelKey: "shape.rounded" },
    { value: "classy",         labelKey: "shape.classy" },
    { value: "classy-rounded", labelKey: "shape.classyRounded" },
    { value: "extra-rounded",  labelKey: "shape.extraRounded" },
] as const;

export const QR_CORNER_SQUARE_STYLES = [
    { value: "square",        labelKey: "shape.square" },
    { value: "dot",           labelKey: "shape.dot" },
    { value: "extra-rounded", labelKey: "shape.roundedShort" },
] as const;

export const QR_CORNER_DOT_STYLES = [
    { value: "square", labelKey: "shape.square" },
    { value: "dot",    labelKey: "shape.dot" },
] as const;

export const EC_LEVELS = [
    { value: "L", labelKey: "common.low" },
    { value: "M", labelKey: "common.medium" },
    { value: "Q", labelKey: "common.high" },
    { value: "H", labelKey: "common.highest" },
] as const;

export const QR_MODES = [
    { value: "Byte",         labelKey: "mode.byte" },
    { value: "Numeric",      labelKey: "mode.numeric" },
    { value: "Alphanumeric", labelKey: "mode.alphanumeric" },
    { value: "Kanji",        labelKey: "mode.kanji" },
] as const;

export const QR_FONT_FAMILIES = [
    "monospace", "sans-serif", "serif",
    "Arial", "Verdana", "Courier New", "Georgia",
] as const;

/* ── 기본값 팩토리 ─────────────────────────────────────────── */

export function makeDefaultColor(solid: string): ColorConfig {
    return {
        mode: "solid",
        solid,
        gradient: { type: "linear", rotation: 0, color1: solid, color2: "#4b5563" },
    };
}

export function makeDefaultDeco(text = ""): DecorationSide {
    return { enabled: false, text, fontSize: 18, color: "#ffffff", bold: false };
}

export const DEFAULT_QR: QRState = {
    width: 230, height: 230, margin: 3,
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "M",
    dotStyle:          "square",
    cornerSquareStyle: "square",
    cornerDotStyle:    "square",
    dotColor:          makeDefaultColor("#111827"),
    cornerSquareColor: makeDefaultColor("#111827"),
    cornerDotColor:    makeDefaultColor("#111827"),
    backgroundColor: "#f8fafc",
    transparentBg: false,
    image: null, imageName: "", imageSize: 0.4, imageMargin: 5,
    showText: false,
    useTextOverride: false,
    textOverride: "",
    textAlign: "center",
    textPosition: "bottom",
    font: "monospace",
    bold: false, italic: false,
    fontSize: 16, textMargin: 5,
    textColor: "#000000",
    border: {
        enabled: false,
        thickness: 40, color: "#111827", round: 0, dash: "",
        decoTop:    makeDefaultDeco("SCAN ME"),
        decoBottom: makeDefaultDeco(""),
        decoLeft:   makeDefaultDeco(""),
        decoRight:  makeDefaultDeco(""),
    },
};
