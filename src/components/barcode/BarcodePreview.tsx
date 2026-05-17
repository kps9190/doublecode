import { useCallback, useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import type { BarcodeState, BarcodeReadyAPI } from "../../types";
import { serializeSVG, downloadAsSVG, downloadAsPNG, makeSafeName } from "../../utils";
import { EMPTY_CODE_MESSAGE, UNSUPPORTED_BARCODE_MESSAGE } from "../../constants";
import { buildBarcodeOptions, clearBarcodeSVG } from "./barcodePreviewConfig";
import { useI18n } from "../../i18n";

interface Props {
    codeData: string;
    opts: BarcodeState;
    onErrorChange?: (msg: string | null) => void;
    onReady?: (api: BarcodeReadyAPI) => void;
}

/**
 * 바코드 미리보기.
 * 고정 panelHeight 없음 — JsBarcode 가 생성한 SVG 실제 크기로 렌더링.
 */
export default function BarcodePreview({ codeData, opts, onErrorChange, onReady }: Props) {
    const { t } = useI18n();
    const svgRef = useRef<SVGSVGElement>(null);
    const [error, setError] = useState<string | null>(null);

    const reportError = useCallback((msg: string | null) => {
        setError(msg);
        onErrorChange?.(msg);
    }, [onErrorChange]);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg || !codeData) { reportError(null); return; }
        try {
            let isValid = true;
            JsBarcode(svg, codeData, buildBarcodeOptions(opts, (v) => { isValid = v; }));
            reportError(isValid ? null : UNSUPPORTED_BARCODE_MESSAGE);
        } catch {
            clearBarcodeSVG(svg);
            reportError(UNSUPPORTED_BARCODE_MESSAGE);
        }
    }, [codeData, opts, reportError]);

    const makeFilename = useCallback((ext: string) => {
        const label = opts.useTextOverride && opts.textOverride.trim() ? opts.textOverride : codeData;
        return `barcode_${opts.format}_${makeSafeName(label) || "code"}.${ext}`;
    }, [codeData, opts]);

    useEffect(() => {
        if (!onReady) return;
        onReady({
            canDownload: !error && !!codeData,
            downloadSVG: () => {
                const svg = svgRef.current;
                if (!svg) return;
                downloadAsSVG(makeFilename("svg"), serializeSVG(svg).xml);
            },
            downloadPNG: (scale = 3) => {
                const svg = svgRef.current;
                if (!svg) return;
                downloadAsPNG(makeFilename("png"), serializeSVG(svg), opts.transparentBg ? "transparent" : opts.background, scale);
            },
        });
    }, [error, codeData, opts, makeFilename, onReady]);

    const showSvg = !!codeData && !error;
    const showMessage = !showSvg;
    const previewBg = showSvg
        ? opts.transparentBg ? "checkerboard shadow-lg shadow-slate-950/20" : "bg-white shadow-lg shadow-slate-950/20"
        : "bg-transparent shadow-none";

    return (
        <div className={`inline-flex max-w-full overflow-auto rounded-md ${previewBg} ${showMessage ? "px-6 py-5" : "p-0"}`}>
            {!codeData && (
                <p className="text-sm text-slate-400">{t(EMPTY_CODE_MESSAGE)}</p>
            )}
            {!!codeData && !!error && (
                <div className="text-sm text-amber-400 text-center py-4 space-y-1">
                    <div className="text-xl">⚠️</div>
                    <p className="text-xs">{t(error)}</p>
                </div>
            )}
            <div className={showSvg ? "inline-flex max-w-full" : "hidden"}>
                <svg ref={svgRef} className="block h-auto max-w-full" />
            </div>
        </div>
    );
}
