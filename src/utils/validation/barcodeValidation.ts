import { eanChecksum, expandUPCEToUPCA, itf14Checksum } from "./barcodeChecksums";

const NUMERIC = /^\d+$/;

function validateChecksum(value: string, length: number, checksum: (value: string) => number, key: string) {
    if (!NUMERIC.test(value)) return "barcode.digitsOnly";
    if (value.length === length - 1) return null;
    if (value.length !== length) return key;
    return Number(value[length - 1]) === checksum(value) ? null : "barcode.checksum";
}

function isAsciiRange(value: string, min: number, max: number) {
    return [...value].every((char) => {
        const code = char.charCodeAt(0);
        return code >= min && code <= max;
    });
}

export function validateBarcodeData(value: string, format: string): string | null {
    if (!value.trim()) return null;

    switch (format) {
        case "EAN2":
            return /^\d{2}$/.test(value) ? null : "barcode.ean2";
        case "EAN5":
            return /^\d{5}$/.test(value) ? null : "barcode.ean5";
        case "EAN8":
            return validateChecksum(value, 8, eanChecksum, "barcode.ean8");
        case "EAN13":
            return validateChecksum(value, 13, eanChecksum, "barcode.ean13");
        case "UPC":
            return validateChecksum(value, 12, eanChecksum, "barcode.upc");
        case "ITF":
            if (!NUMERIC.test(value)) return "barcode.digitsOnly";
            return value.length % 2 === 0 ? null : "barcode.itfEven";
        case "ITF14":
            return validateChecksum(value, 14, itf14Checksum, "barcode.itf14");
        case "CODE128A":
            return isAsciiRange(value, 0, 95) ? null : "barcode.code128a";
        case "CODE128B":
            return isAsciiRange(value, 32, 127) ? null : "barcode.code128b";
        case "CODE128C":
            return /^(\d{2})+$/.test(value) ? null : "barcode.code128c";
        case "CODE39":
            return /^[0-9A-Za-z\-. $/+%]+$/.test(value) ? null : "barcode.code39";
        case "MSI":
        case "MSI10":
        case "MSI11":
        case "MSI1010":
        case "MSI1110":
            return NUMERIC.test(value) ? null : "barcode.digitsOnly";
        case "pharmacode": {
            if (!NUMERIC.test(value)) return "barcode.digitsOnly";
            const number = Number(value);
            return number >= 3 && number <= 131070 ? null : "barcode.pharmacode";
        }
        case "codabar":
            if (/^[0-9\-$:.+/]+$/.test(value)) return null;
            if (/^[A-Da-d]/.test(value) || /[A-Da-d]$/.test(value)) {
                return /^[A-Da-d][0-9\-$:.+/]+[A-Da-d]$/.test(value) ? null : "barcode.codabarStartEnd";
            }
            return "barcode.codabar";
        case "UPCE":
            if (!NUMERIC.test(value)) return "barcode.digitsOnly";
            if (/^\d{6}$/.test(value)) return null;
            if (!/^[01]\d{7}$/.test(value)) return "barcode.upce";
            return Number(value[7]) === eanChecksum(expandUPCEToUPCA(value.slice(1, 7), value[0]) + value[7])
                ? null
                : "barcode.checksum";
        default:
            return null;
    }
}
