import { useCallback, useState } from "react";
import type { QRState } from "../types";
import { DEFAULT_QR } from "../constants";

export interface UseQRStateReturn {
    opts:        QRState;
    setOpts:     (patch: Partial<QRState>) => void;
    patchBorder: (patch: Partial<QRState["border"]>) => void;
}

/**
 * QR코드 설정 상태만 담당한다.
 * 렌더 제어(forceRecreate, showActual)나 API 핸들은 포함하지 않는다.
 */
export function useQRState(): UseQRStateReturn {
    const [opts, setOptsState] = useState<QRState>(DEFAULT_QR);

    const setOpts = useCallback(
        (patch: Partial<QRState>) =>
            setOptsState((prev) => ({ ...prev, ...patch })),
        []
    );

    const patchBorder = useCallback(
        (patch: Partial<QRState["border"]>) =>
            setOptsState((prev) => ({
                ...prev,
                border: { ...prev.border, ...patch },
            })),
        []
    );

    return { opts, setOpts, patchBorder };
}
