import type { RefObject } from "react";
import QRPreview from "./QRPreview";
import type { QRState, QRReadyAPI } from "../../types";
import { validateQRData } from "../../utils";

interface Props {
    renderKey:    number;
    codeData:     string;
    opts:         QRState;
    containerRef: RefObject<HTMLDivElement | null>;
    onReady:      (api: QRReadyAPI) => void;
    onWarning:    (msg: string | null) => void;
    warning:      string | null;
}

/**
 * QR 미리보기 카드.
 * 실제 크기 보기 제거 — opts.width × opts.height 그대로 렌더링.
 * QR가 컬럼보다 크면 overflow-auto로 스크롤.
 */
export default function QRCard({ renderKey, codeData, opts, containerRef, onReady, onWarning, warning }: Props) {
    const isEmpty = !codeData.trim();
    const hasWarning = !!warning || !!validateQRData(codeData, opts.mode);
    const bgClass = isEmpty || hasWarning
        ? "bg-transparent shadow-none"
        : `${opts.transparentBg ? "checkerboard" : "bg-white"} shadow-lg shadow-slate-950/20`;

    return (
        <div ref={containerRef} className={`inline-flex max-w-full overflow-auto rounded-md ${bgClass}`}>
            <QRPreview
                key={renderKey}
                codeData={codeData}
                opts={opts}
                onReady={onReady}
                onWarning={onWarning}
            />
        </div>
    );
}
