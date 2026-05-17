/**
 * SVG 직렬화 및 SVG/PNG 다운로드.
 * 바코드 SVGSVGElement → 파일 저장 흐름에 사용한다.
 */
import { blobToDownload } from "./triggerDownload";

export interface SerializedSVG {
    xml:    string;
    width:  number;
    height: number;
}

/** SVGSVGElement 를 XML 문자열로 직렬화하고 실제 크기도 반환한다. */
export function serializeSVG(svg: SVGSVGElement): SerializedSVG {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    if (!clone.getAttribute("xmlns"))
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    if (!clone.getAttribute("xmlns:xlink"))
        clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clone.removeAttribute("class");

    const w = Number(clone.getAttribute("width"))  || svg.clientWidth  || 300;
    const h = Number(clone.getAttribute("height")) || svg.clientHeight || 150;
    clone.setAttribute("width",  String(w));
    clone.setAttribute("height", String(h));
    if (!clone.getAttribute("viewBox"))
        clone.setAttribute("viewBox", `0 0 ${w} ${h}`);

    return { xml: new XMLSerializer().serializeToString(clone), width: w, height: h };
}

/** 직렬화된 SVG XML 을 .svg 파일로 다운로드한다. */
export function downloadAsSVG(filename: string, xml: string): void {
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    blobToDownload(filename, blob);
}

/** SVG XML → Canvas → .png 파일로 다운로드한다. */
export function downloadAsPNG(
    filename: string,
    serialized: SerializedSVG,
    background: string,
    scale = 3
): void {
    const { xml, width, height } = serialized;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const canvas  = document.createElement("canvas");
        canvas.width  = Math.max(1, Math.floor(width  * scale));
        canvas.height = Math.max(1, Math.floor(height * scale));
        const ctx = canvas.getContext("2d")!;

        if (background !== "transparent") {
            ctx.fillStyle = background || "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => { if (blob) blobToDownload(filename, blob); },
            "image/png"
        );
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(xml)))}`;
}
