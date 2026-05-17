import { useCallback, useState } from "react";
import type { BarcodeState, BarcodeReadyAPI } from "../types";
import { DEFAULT_BARCODE } from "../constants";

export interface UseBarcodeReturn {
    opts:    BarcodeState;
    setOpts: (patch: Partial<BarcodeState>) => void;
    api:     BarcodeReadyAPI | null;
    setApi:  (api: BarcodeReadyAPI | null) => void;
    error:   string | null;
    setError:(msg: string | null) => void;
}

/**
 * 바코드 설정 상태 + API 핸들을 캡슐화한 훅.
 * BarcodePreview 가 준비되면 setApi() 로 API 를 등록한다.
 */
export function useBarcode(): UseBarcodeReturn {
    const [opts,  setOptsState] = useState<BarcodeState>(DEFAULT_BARCODE);
    const [api,   setApi]       = useState<BarcodeReadyAPI | null>(null);
    const [error, setError]     = useState<string | null>(null);

    const setOpts = useCallback(
        (patch: Partial<BarcodeState>) =>
            setOptsState((prev) => ({ ...prev, ...patch })),
        []
    );

    return { opts, setOpts, api, setApi, error, setError };
}
