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

/**
 * 파일 다운로드에 안전한 파일명 생성.
 * 공백 → 언더스코어, 특수문자 제거, 길이 제한.
 */
export function makeSafeName(s: string, maxLen = 64): string {
    return (s || "")
        .replace(/\s+/g, "_")
        .replace(/[^\w-]+/g, "_")
        .replace(/_+/g, "_")
        .slice(0, maxLen)
        .replace(/^_+|_+$/g, "");
}
