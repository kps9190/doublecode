import type { BarcodeState } from "../types";

export const BARCODE_FORMATS = [
    { value: "CODE128",    label: "CODE128 Auto" },
    { value: "CODE128A",   label: "CODE128 A" },
    { value: "CODE128B",   label: "CODE128 B" },
    { value: "CODE128C",   label: "CODE128 C" },
    { value: "CODE39",     label: "CODE 39" },
    { value: "EAN2",       label: "EAN 2" },
    { value: "EAN5",       label: "EAN 5" },
    { value: "EAN8",       label: "EAN 8" },
    { value: "EAN13",      label: "EAN 13" },
    { value: "UPC",        label: "UPC" },
    { value: "ITF",        label: "ITF" },
    { value: "ITF14",      label: "ITF14" },
    { value: "MSI",        label: "MSI" },
    { value: "MSI10",      label: "MSI10" },
    { value: "MSI11",      label: "MSI11" },
    { value: "MSI1010",    label: "MSI1010" },
    { value: "MSI1110",    label: "MSI1110" },
    { value: "pharmacode", label: "Pharmacode" },
    { value: "UPCE",       label: "UPCE" },
    { value: "codabar",    label: "CODABAR" },
] as const;

export const FONT_FAMILIES = [
    { value: "monospace",   label: "Monospace" },
    { value: "sans-serif",  label: "Sans-serif" },
    { value: "serif",       label: "Serif" },
    { value: "fantasy",     label: "Fantasy" },
    { value: "cursive",     label: "Cursive" },
    { value: "Arial",       label: "Arial" },
    { value: "Verdana",     label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
    { value: "Georgia",     label: "Georgia" },
    { value: "Tahoma",      label: "Tahoma" },
] as const;

export const EAN_FORMATS = new Set(["EAN2", "EAN5", "EAN8", "EAN13", "UPC", "UPCE"]);

export const DEFAULT_BARCODE: BarcodeState = {
    format: "CODE128",
    lineColor: "#000000",
    background: "#ffffff",
    transparentBg: false,
    width: 2,
    height: 100,
    margin: 10,
    useDetailedMargin: false,
    marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10,
    displayValue: true,
    useTextOverride: false,
    textOverride: "",
    textAlign: "center",
    textPosition: "bottom",
    font: "monospace",
    bold: false,
    italic: false,
    fontSize: 20,
    textMargin: 2,
    isEAN: false,
    flat: false,
};
