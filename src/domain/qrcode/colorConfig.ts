import type { ColorConfig, QRState } from "../../types";

export type QRColorState = Pick<QRState, "dotColor" | "cornerSquareColor" | "cornerDotColor">;
export type QRColorKey = keyof QRColorState;

export function cloneColorConfig(color: ColorConfig): ColorConfig {
    return {
        ...color,
        gradient: { ...color.gradient },
    };
}

export function cloneQRColorState(opts: QRColorState): QRColorState {
    return {
        dotColor: cloneColorConfig(opts.dotColor),
        cornerSquareColor: cloneColorConfig(opts.cornerSquareColor),
        cornerDotColor: cloneColorConfig(opts.cornerDotColor),
    };
}

export function applyColorToAllQRParts(color: ColorConfig): QRColorState {
    return {
        dotColor: color,
        cornerSquareColor: cloneColorConfig(color),
        cornerDotColor: cloneColorConfig(color),
    };
}
