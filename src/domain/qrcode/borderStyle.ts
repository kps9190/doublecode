export const BORDER_STYLE_DASH = {
    solid: "",
    dotted: "2,4",
    dashed: "6,4",
    longDashed: "12,6",
} as const;

export type BorderStyle = keyof typeof BORDER_STYLE_DASH;

export const BORDER_STYLE_OPTIONS = [
    { value: "solid",      labelKey: "qr.borderStyleSolid" },
    { value: "dotted",     labelKey: "qr.borderStyleDotted" },
    { value: "dashed",     labelKey: "qr.borderStyleDashed" },
    { value: "longDashed", labelKey: "qr.borderStyleLongDashed" },
] as const;

export function getBorderStyleValue(dash: string): BorderStyle | "" {
    const normalizedDash = dash.replace(/\s/g, "");
    const matched = BORDER_STYLE_OPTIONS.find(({ value }) => BORDER_STYLE_DASH[value] === normalizedDash);
    return matched?.value ?? "";
}

export function parseDashValues(dash: string) {
    const [length, gap] = dash.split(",").map((value) => parseInt(value.trim(), 10));
    return {
        length: Number.isFinite(length) && length > 0 ? length : 6,
        gap: Number.isFinite(gap) && gap >= 0 ? gap : 4,
    };
}

export function clampDashValue(value: number, fallback: number, min = 0) {
    if (!Number.isFinite(value)) return fallback;
    return Math.max(min, Math.min(99, Math.round(value)));
}
