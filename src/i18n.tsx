/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "ko" | "en";

type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
    ko: {
        "app.title": "바코드 & QR코드 만들기",
        "app.subtitle": "한번의 입력으로 바코드와 QR코드를 동시에!!",
        "app.footer": "DoubleCode · doublecode.net",
        "theme.light": "라이트 모드",
        "theme.dark": "다크 모드",
        "language.toggle": "English",
        "mobile.barcode": "바코드",
        "mobile.qr": "QR코드",

        "common.empty": "텍스트를 입력하세요",
        "common.basic": "기본",
        "common.color": "색상",
        "common.textSettings": "글자 설정 보기",
        "common.showText": "글자 표시",
        "common.overrideText": "글자 덮어쓰기",
        "common.displayText": "표시할 글자",
        "common.horizontal": "수평 위치",
        "common.vertical": "수직 위치",
        "common.font": "글꼴",
        "common.textStyle": "글자 속성",
        "common.textSize": "글자 크기",
        "common.textMargin": "글자 간격",
        "common.textColor": "글자 색",
        "common.bold": "굵게",
        "common.italic": "기울임",
        "common.left": "왼쪽",
        "common.center": "중앙",
        "common.right": "오른쪽",
        "common.top": "위",
        "common.bottom": "아래",
        "common.up": "위",
        "common.down": "아래",
        "common.low": "낮음",
        "common.medium": "중간",
        "common.high": "높음",
        "common.highest": "최고",
        "common.transparentBackground": "투명 배경",
        "common.transparentShort": "투명",
        "common.backgroundColor": "배경 색상",
        "common.png": "PNG 다운로드",
        "common.svg": "SVG 다운로드",
        "common.advanced": "고급설정",

        "input.add": "입력창 추가",
        "input.placeholder": "여기에 만들 코드의 내용을 입력하세요",

        "barcode.options": "바코드 설정",
        "barcode.format": "바코드 유형",
        "barcode.lineWidth": "선 간격",
        "barcode.height": "높이",
        "barcode.flat": "Flat 스타일",
        "barcode.marginSection": "배경 간격",
        "barcode.detailedMargin": "상세 조절",
        "barcode.margin": "배경 간격",
        "barcode.color": "바코드 색",
        "barcode.backgroundColor": "배경 색",
        "barcode.unsupported": "선택하신 바코드 유형으로는 표시할 수 없는 글자가 포함되어 있습니다.",
        "barcode.digitsOnly": "선택하신 바코드 유형은 숫자만 입력할 수 있습니다.",
        "barcode.checksum": "체크섬이 맞지 않습니다. 마지막 숫자를 확인해 주세요.",
        "barcode.ean2": "EAN 2는 숫자 2자리만 입력할 수 있습니다.",
        "barcode.ean5": "EAN 5는 숫자 5자리만 입력할 수 있습니다.",
        "barcode.ean8": "EAN 8은 숫자 7자리 또는 올바른 체크섬을 포함한 8자리여야 합니다.",
        "barcode.ean13": "EAN 13은 숫자 12자리 또는 올바른 체크섬을 포함한 13자리여야 합니다.",
        "barcode.upc": "UPC는 숫자 11자리 또는 올바른 체크섬을 포함한 12자리여야 합니다.",
        "barcode.upce": "UPC-E는 숫자 6자리 또는 번호 체계와 체크섬을 포함한 8자리여야 합니다.",
        "barcode.itfEven": "ITF는 숫자를 짝수 자리로 입력해야 합니다.",
        "barcode.itf14": "ITF14는 숫자 13자리 또는 올바른 체크섬을 포함한 14자리여야 합니다.",
        "barcode.code128a": "CODE128 A는 ASCII 0~95 범위의 문자만 입력할 수 있습니다.",
        "barcode.code128b": "CODE128 B는 ASCII 32~127 범위의 문자만 입력할 수 있습니다.",
        "barcode.code128c": "CODE128 C는 숫자를 짝수 자리로 입력해야 합니다.",
        "barcode.code39": "CODE 39는 숫자, 영문, 공백, - . $ / + % 만 사용할 수 있습니다.",
        "barcode.pharmacode": "Pharmacode는 3부터 131070 사이의 숫자만 입력할 수 있습니다.",
        "barcode.codabar": "CODABAR는 숫자와 - $ : . + / 만 입력할 수 있습니다.",
        "barcode.codabarStartEnd": "CODABAR 시작/끝 문자는 A, B, C, D만 사용할 수 있습니다.",

        "qr.options": "QR코드 설정",
        "qr.size": "QR 크기",
        "qr.margin": "QR 여백",
        "qr.errorCorrection": "오류정정 수준",
        "qr.mode": "QR 모드",
        "qr.shapeSettings": "모양 설정",
        "qr.dotShape": "점 모양",
        "qr.cornerSquare": "모서리 사각형",
        "qr.cornerDot": "모서리 점",
        "qr.allShape": "전체 모양",
        "qr.dotColor": "점 색상",
        "qr.cornerSquareColor": "모서리 사각형 색",
        "qr.cornerDotColor": "모서리 점 색",
        "qr.allColor": "전체 색상",
        "qr.imageSection": "이미지 삽입",
        "qr.centerImage": "중앙 이미지",
        "qr.chooseImage": "이미지 선택",
        "qr.imageSelected": "선택됨",
        "qr.removeImage": "이미지 제거",
        "qr.imageSize": "이미지 크기",
        "qr.imageMargin": "이미지 여백",
        "qr.border": "테두리",
        "qr.borderDisabled": "공식 QR 테두리 플러그인 연결은 완료됐지만, 현재 기능은 꺼져 있습니다.",
        "qr.useBorder": "테두리 사용",
        "qr.borderThickness": "두께",
        "qr.borderRound": "둥근 정도",
        "qr.borderColor": "테두리 색",
        "qr.dashPattern": "점선 패턴",
        "qr.dashPlaceholder": "예: 6,4 (비워두면 실선)",
        "qr.decorationText": "장식 텍스트",
        "qr.unsupported": "선택하신 QR코드 유형으로는 표시할 수 없는 글자가 포함되어 있습니다.",
        "qr.numericOnly": "숫자 모드에서는 숫자(0~9)만 입력할 수 있습니다.",
        "qr.alphanumericOnly": "영숫자 모드에서는 숫자·대문자 영문·일부 특수문자($%*+-./: )만 사용할 수 있습니다.",

        "mode.byte": "바이트",
        "mode.numeric": "숫자",
        "mode.alphanumeric": "영숫자",
        "mode.kanji": "한자",
        "shape.square": "사각형",
        "shape.dot": "원형",
        "shape.rounded": "둥근 사각형",
        "shape.classy": "고급형",
        "shape.classyRounded": "고급 둥근형",
        "shape.extraRounded": "완전 원형",
        "shape.roundedShort": "둥근형",
        "color.solid": "단색",
        "color.gradient": "그라디언트",
        "color.linear": "선형",
        "color.radial": "방사형",
    },
    en: {
        "app.title": "Barcode & QR Code Generator",
        "app.subtitle": "Create barcodes and QR codes from one input.",
        "app.footer": "DoubleCode · doublecode.net",
        "theme.light": "Light mode",
        "theme.dark": "Dark mode",
        "language.toggle": "한국어",
        "mobile.barcode": "Barcode",
        "mobile.qr": "QR Code",

        "common.empty": "Enter text",
        "common.basic": "Basic",
        "common.color": "Color",
        "common.textSettings": "Text settings",
        "common.showText": "Show text",
        "common.overrideText": "Override text",
        "common.displayText": "Display text",
        "common.horizontal": "Horizontal position",
        "common.vertical": "Vertical position",
        "common.font": "Font",
        "common.textStyle": "Text style",
        "common.textSize": "Text size",
        "common.textMargin": "Text spacing",
        "common.textColor": "Text color",
        "common.bold": "Bold",
        "common.italic": "Italic",
        "common.left": "Left",
        "common.center": "Center",
        "common.right": "Right",
        "common.top": "Top",
        "common.bottom": "Bottom",
        "common.up": "Top",
        "common.down": "Bottom",
        "common.low": "Low",
        "common.medium": "Medium",
        "common.high": "High",
        "common.highest": "Highest",
        "common.transparentBackground": "Transparent background",
        "common.transparentShort": "Clear",
        "common.backgroundColor": "Background color",
        "common.png": "Download PNG",
        "common.svg": "Download SVG",
        "common.advanced": "Advanced",

        "input.add": "Add input",
        "input.placeholder": "Enter the content to encode",

        "barcode.options": "Barcode Settings",
        "barcode.format": "Barcode type",
        "barcode.lineWidth": "Line width",
        "barcode.height": "Height",
        "barcode.flat": "Flat style",
        "barcode.marginSection": "Background spacing",
        "barcode.detailedMargin": "Detailed spacing",
        "barcode.margin": "Background spacing",
        "barcode.color": "Barcode color",
        "barcode.backgroundColor": "Background color",
        "barcode.unsupported": "This barcode type cannot display some of the entered characters.",
        "barcode.digitsOnly": "This barcode type only accepts digits.",
        "barcode.checksum": "The checksum does not match. Check the final digit.",
        "barcode.ean2": "EAN 2 must be exactly 2 digits.",
        "barcode.ean5": "EAN 5 must be exactly 5 digits.",
        "barcode.ean8": "EAN 8 must be 7 digits, or 8 digits with a valid checksum.",
        "barcode.ean13": "EAN 13 must be 12 digits, or 13 digits with a valid checksum.",
        "barcode.upc": "UPC must be 11 digits, or 12 digits with a valid checksum.",
        "barcode.upce": "UPC-E must be 6 digits, or 8 digits with number system and checksum.",
        "barcode.itfEven": "ITF must contain an even number of digits.",
        "barcode.itf14": "ITF14 must be 13 digits, or 14 digits with a valid checksum.",
        "barcode.code128a": "CODE128 A only supports ASCII characters 0-95.",
        "barcode.code128b": "CODE128 B only supports ASCII characters 32-127.",
        "barcode.code128c": "CODE128 C must contain an even number of digits.",
        "barcode.code39": "CODE 39 only supports digits, letters, spaces, and - . $ / + %.",
        "barcode.pharmacode": "Pharmacode only accepts numbers from 3 to 131070.",
        "barcode.codabar": "CODABAR only supports digits and - $ : . + /.",
        "barcode.codabarStartEnd": "CODABAR start/end characters must be A, B, C, or D.",

        "qr.options": "QR Code Settings",
        "qr.size": "QR size",
        "qr.margin": "QR margin",
        "qr.errorCorrection": "Error correction",
        "qr.mode": "QR mode",
        "qr.shapeSettings": "Shape",
        "qr.dotShape": "Dot shape",
        "qr.cornerSquare": "Corner square",
        "qr.cornerDot": "Corner dot",
        "qr.allShape": "All shapes",
        "qr.dotColor": "Dot color",
        "qr.cornerSquareColor": "Corner square color",
        "qr.cornerDotColor": "Corner dot color",
        "qr.allColor": "All colors",
        "qr.imageSection": "Center image",
        "qr.centerImage": "Center image",
        "qr.chooseImage": "Choose image",
        "qr.imageSelected": "Selected",
        "qr.removeImage": "Remove image",
        "qr.imageSize": "Image size",
        "qr.imageMargin": "Image margin",
        "qr.border": "Border",
        "qr.borderDisabled": "The official QR border plugin is connected, but this feature is currently disabled.",
        "qr.useBorder": "Use border",
        "qr.borderThickness": "Thickness",
        "qr.borderRound": "Roundness",
        "qr.borderColor": "Border color",
        "qr.dashPattern": "Dash pattern",
        "qr.dashPlaceholder": "e.g. 6,4 (blank for solid)",
        "qr.decorationText": "Decoration text",
        "qr.unsupported": "This QR mode cannot display some of the entered characters.",
        "qr.numericOnly": "Numeric mode only supports digits 0-9.",
        "qr.alphanumericOnly": "Alphanumeric mode only supports digits, uppercase letters, and $%*+-./: plus spaces.",

        "mode.byte": "Byte",
        "mode.numeric": "Numeric",
        "mode.alphanumeric": "Alphanumeric",
        "mode.kanji": "Kanji",
        "shape.square": "Square",
        "shape.dot": "Dot",
        "shape.rounded": "Rounded",
        "shape.classy": "Classy",
        "shape.classyRounded": "Classy rounded",
        "shape.extraRounded": "Extra rounded",
        "shape.roundedShort": "Rounded",
        "color.solid": "Solid",
        "color.gradient": "Gradient",
        "color.linear": "Linear",
        "color.radial": "Radial",
    },
};

interface I18nValue {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function getInitialLanguage(): Language {
    const saved = localStorage.getItem("doublecode-language");
    if (saved === "ko" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = (next: Language) => {
        setLanguageState(next);
        localStorage.setItem("doublecode-language", next);
        document.documentElement.lang = next;
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo<I18nValue>(() => ({
        language,
        setLanguage,
        toggleLanguage: () => setLanguage(language === "ko" ? "en" : "ko"),
        t: (key) => dictionaries[language][key] ?? key,
    }), [language]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
    const value = useContext(I18nContext);
    if (!value) throw new Error("useI18n must be used inside I18nProvider");
    return value;
}
