import { useCallback, useRef, useState } from "react";

export interface UseQRViewReturn {
    renderKey:     number;
    forceRecreate: () => void;
    containerRefM: React.RefObject<HTMLDivElement | null>;
    containerRefD: React.RefObject<HTMLDivElement | null>;
}

/**
 * QR 렌더 제어를 담당한다.
 * "실제 크기 보기" 제거 — 패널 크기에 맞게 항상 자동 축소된다.
 */
export function useQRView(): UseQRViewReturn {
    const [renderKey, setRenderKey] = useState(0);
    const containerRefM = useRef<HTMLDivElement>(null);
    const containerRefD = useRef<HTMLDivElement>(null);
    const forceRecreate = useCallback(() => setRenderKey((k) => k + 1), []);
    return { renderKey, forceRecreate, containerRefM, containerRefD };
}
