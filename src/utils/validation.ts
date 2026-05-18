import type { QRMode } from "../types";

/**
 * QR 모드별 입력값 유효성 검사.
 * 유효하면 null, 무효하면 에러 메시지 반환.
 */
export function validateQRData(value: string, mode: QRMode): string | null {
    if (!value || !value.trim()) return null;

    if (mode === "Numeric") {
        if (!/^\d+$/.test(value))
            return "qr.numericOnly";
    }

    if (mode === "Alphanumeric") {
        // QR 스펙: 0-9, A-Z(대문자), 공백, $, %, *, +, -, ., /, :
        if (!/^[0-9A-Z $%*+\-./:]+$/.test(value))
            return "qr.alphanumericOnly";
    }

    return null;
}
