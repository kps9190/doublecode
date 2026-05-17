import { useState } from "react";
import type { QRReadyAPI } from "../types";
import { useQRState, type UseQRStateReturn } from "./useQRState";
import { useQRView,  type UseQRViewReturn  } from "./useQRView";

export interface UseQRCodeReturn extends UseQRStateReturn, UseQRViewReturn {
    api:        QRReadyAPI | null;
    setApi:     (api: QRReadyAPI | null) => void;
    warning:    string | null;
    setWarning: (msg: string | null) => void;
}

export function useQRCode(): UseQRCodeReturn {
    const state = useQRState();
    const view  = useQRView();
    const [api,     setApi]     = useState<QRReadyAPI | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    return { ...state, ...view, api, setApi, warning, setWarning };
}
