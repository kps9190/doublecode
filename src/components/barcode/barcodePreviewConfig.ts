import type JsBarcode from "jsbarcode";
import type { BarcodeState } from "../../types";

export function buildBarcodeOptions(
    opts: BarcodeState,
    onValidityChange: (valid: boolean) => void
): JsBarcode.Options {
    return {
        format: opts.format,
        lineColor: opts.lineColor,
        background: opts.transparentBg ? "transparent" : opts.background,
        width: opts.width,
        height: opts.height,
        displayValue: opts.displayValue,
        text: opts.useTextOverride ? opts.textOverride : undefined,
        textAlign: opts.textAlign,
        textPosition: opts.textPosition,
        font: opts.font,
        fontOptions: [opts.bold ? "bold" : "", opts.italic ? "italic" : ""].filter(Boolean).join(" "),
        fontSize: opts.fontSize,
        textMargin: opts.textMargin,
        flat: opts.isEAN ? opts.flat : undefined,
        valid: onValidityChange,
        ...(opts.useDetailedMargin
            ? {
                  marginTop: opts.marginTop,
                  marginBottom: opts.marginBottom,
                  marginLeft: opts.marginLeft,
                  marginRight: opts.marginRight,
              }
            : { margin: opts.margin }),
    };
}

export function applyBarcodeTextColor(svg: SVGSVGElement | null, color: string): void {
    if (!svg) return;

    svg.querySelectorAll("text").forEach((text) => {
        text.setAttribute("fill", color);
    });
}

export function clearBarcodeSVG(svg: SVGSVGElement | null): void {
    if (!svg) return;

    svg.innerHTML = "";
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.removeAttribute("viewBox");
}
