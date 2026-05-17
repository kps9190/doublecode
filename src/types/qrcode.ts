export type DotCornerStyle =
    | "dot" | "square" | "extra-rounded"
    | "rounded" | "dots" | "classy" | "classy-rounded";

export type ColorMode    = "solid" | "gradient";
export type GradientType = "linear" | "radial";
export type QRMode       = "Numeric" | "Alphanumeric" | "Byte" | "Kanji";
export type ECLevel      = "L" | "M" | "Q" | "H";

export interface GradientConfig {
    type:     GradientType;
    rotation: number;
    color1:   string;
    color2:   string;
}

export interface ColorConfig {
    mode:     ColorMode;
    solid:    string;
    gradient: GradientConfig;
}

export interface DecorationSide {
    enabled:  boolean;
    text:     string;
    fontSize: number;
    color:    string;
    bold:     boolean;
}

export interface QRBorderState {
    enabled:    boolean;
    thickness:  number;
    color:      string;
    round:      number;
    dash:       string;
    decoTop:    DecorationSide;
    decoBottom: DecorationSide;
    decoLeft:   DecorationSide;
    decoRight:  DecorationSide;
}

export interface QRState {
    width:  number;
    height: number;
    margin: number;
    typeNumber: number;
    mode:   QRMode;
    errorCorrectionLevel: ECLevel;
    dotStyle:          DotCornerStyle;
    cornerSquareStyle: DotCornerStyle;
    cornerDotStyle:    DotCornerStyle;
    dotColor:          ColorConfig;
    cornerSquareColor: ColorConfig;
    cornerDotColor:    ColorConfig;
    backgroundColor: string;
    transparentBg:   boolean;
    image:           string | null;
    imageMargin:     number;
    showText:     boolean;
    useTextOverride: boolean;
    textOverride: string;
    textAlign:    "left" | "center" | "right";
    textPosition: "top" | "bottom";
    font:     string;
    bold:     boolean;
    italic:   boolean;
    fontSize: number;
    textMargin: number;
    textColor:  string;
    border: QRBorderState;
}

export interface QRReadyAPI {
    canDownload: boolean;
    downloadPNG: (name?: string) => void;
    downloadSVG: (name?: string) => void;
}

/** QR 텍스트 다운로드에 필요한 최소 옵션 */
export interface QRTextDownloadOpts {
    showText:       boolean;
    useTextOverride: boolean;
    textOverride:    string;
    fontSize:       number;
    textMargin:     number;
    textAlign:      string;
    textPosition:   string;
    font:           string;
    bold:           boolean;
    italic:         boolean;
    textColor:      string;
    transparentBg:  boolean;
    backgroundColor: string;
    width:          number;
    height:         number;
}
