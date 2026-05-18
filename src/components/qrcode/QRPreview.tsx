import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { QRState, QRReadyAPI } from "../../types";
import { applyQRBorderPlugin, validateQRData, QRDownloadService, clearQRContainer, getQRDisplayText } from "../../utils";
import { EMPTY_CODE_MESSAGE, UNSUPPORTED_QR_MESSAGE } from "../../constants";
import { buildQRConfig, buildQRTextStyle } from "./qrPreviewConfig";
import { useI18n } from "../../i18n";

interface Props {
    codeData:  string;
    opts:      QRState;
    onReady?:   (api: QRReadyAPI) => void;
    onWarning?: (msg: string | null) => void;
}

/**
 * QR코드 미리보기.
 * 고정 panelSize 없음 — opts.width × opts.height 실제 크기로 렌더링.
 */
export default function QRPreview({ codeData, opts, onReady, onWarning }: Props) {
    const { t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef        = useRef<QRCodeStyling | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!codeData.trim()) {
            onWarning?.(null);
            setError(null);
            clearQRContainer(containerRef.current);
            qrRef.current = null;
            return;
        }

        const warn = validateQRData(codeData, opts.mode);
        onWarning?.(warn);
        if (warn) {
            setError(warn);
            clearQRContainer(containerRef.current);
            qrRef.current = null;
            return;
        }

        setError(null);
        if (!containerRef.current) return;

        const data = codeData.trim();
        try {
            const needsInit = !qrRef.current || containerRef.current.children.length === 0;
            const config = buildQRConfig(opts, data);
            if (needsInit) {
                const qr = new QRCodeStyling(config);
                qrRef.current = qr;
                containerRef.current.innerHTML = "";
                qr.append(containerRef.current);
            } else {
                qrRef.current?.update(config);
            }
            applyQRBorderPlugin(qrRef.current, opts.border);
        } catch {
            const message = UNSUPPORTED_QR_MESSAGE;
            clearQRContainer(containerRef.current);
            qrRef.current = null;
            setError(message);
            onWarning?.(message);
        }
    }, [codeData, onWarning, opts]);

    useEffect(() => {
        if (error && containerRef.current) {
            clearQRContainer(containerRef.current);
            qrRef.current = null;
        }
    }, [error]);

    useEffect(() => {
        if (!onReady) return;
        onReady({
            canDownload: !error && !!codeData.trim(),
            downloadPNG: () => new QRDownloadService(containerRef.current, qrRef.current, opts, codeData).downloadPNG(),
            downloadSVG: () => new QRDownloadService(containerRef.current, qrRef.current, opts, codeData).downloadSVG(),
        });
    }, [error, codeData, opts, onReady]);

    const textStyle = useMemo(() => buildQRTextStyle(opts), [opts]);
    const displayText = getQRDisplayText(opts, codeData);

    if (!codeData.trim()) {
        return <p className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{t(EMPTY_CODE_MESSAGE)}</p>;
    }

    if (error) {
        return (
            <div className="text-sm text-amber-400 text-center px-4 space-y-1 py-8">
                <div className="text-2xl">⚠️</div>
                <p className="text-xs">{t(error)}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {opts.showText && opts.textPosition === "top" && (
                <div style={textStyle} className="w-full px-2 break-all">{displayText}</div>
            )}
            <div
                ref={containerRef}
                className="flex max-w-full items-center justify-center"
                style={{ width: opts.width, height: opts.height }}
            />
            {opts.showText && opts.textPosition === "bottom" && (
                <div style={textStyle} className="w-full px-2 break-all">{displayText}</div>
            )}
        </div>
    );
}
