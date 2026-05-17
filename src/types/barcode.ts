export type BarcodeTextAlign    = "left" | "center" | "right";
export type BarcodeTextPosition = "bottom" | "top";
export type BarcodeFontFamily   =
    | "monospace" | "sans-serif" | "serif" | "fantasy" | "cursive"
    | "Arial" | "Verdana" | "Courier New" | "Georgia" | "Tahoma";

export interface BarcodeState {
    format: string;
    lineColor: string;
    background: string;
    transparentBg: boolean;
    width: number;
    height: number;
    margin: number;
    useDetailedMargin: boolean;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    displayValue: boolean;
    useTextOverride: boolean;
    textOverride: string;
    textAlign: BarcodeTextAlign;
    textPosition: BarcodeTextPosition;
    font: BarcodeFontFamily;
    bold: boolean;
    italic: boolean;
    fontSize: number;
    textMargin: number;
    isEAN: boolean;
    flat: boolean;
}

export interface BarcodeReadyAPI {
    canDownload: boolean;
    downloadSVG: () => void;
    downloadPNG: (scale?: number) => void;
}
