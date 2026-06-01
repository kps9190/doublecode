import type { QRMode } from "../../types";

export function validateQRData(value: string, mode: QRMode): string | null {
    if (!value || !value.trim()) return null;

    if (mode === "Numeric" && !/^\d+$/.test(value)) {
        return "qr.numericOnly";
    }

    if (mode === "Alphanumeric" && !/^[0-9A-Z $%*+\-./:]+$/.test(value)) {
        return "qr.alphanumericOnly";
    }

    return null;
}
