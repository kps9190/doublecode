import type QRCodeStyling from "qr-code-styling";
import type { ColorConfig, DecorationSide, QRState } from "../../types";

const SVG_NS = "http://www.w3.org/2000/svg";

type QRCodeOptions = {
    width?: number;
    height?: number;
};

type DecorationPosition = "top" | "bottom" | "left" | "right";
type Bounds = { x: number; y: number; width: number; height: number };

export const isQRBorderEnabled = true;

export function applyQRBorder(qrInstance: QRCodeStyling | null, opts: QRState): void {
    if (!qrInstance) return;

    if (!opts.border.enabled) {
        deleteExtension(qrInstance);
        return;
    }

    qrInstance.applyExtension(createBorderExtension(opts));
}

function createBorderExtension(opts: QRState) {
    return (svg: SVGElement, options: QRCodeOptions): void => {
        const width = readSize(svg, "width", options.width);
        const height = readSize(svg, "height", options.height);
        const size = Math.min(width, height);
        const thickness = getEffectiveThickness(opts.border.thickness, size);
        const outer = centeredBounds(width, height, size);
        const inner = insetBounds(outer, thickness);
        const outerRadius = (size / 2) * opts.border.round;
        const innerRadius = (Math.min(inner.width, inner.height) / 2) * opts.border.round;
        const qrBounds = getQRContentBounds(svg);
        const insertBefore = getOrCreateDefs(svg).nextSibling;

        svg.insertBefore(createRoundedRect(outer, outerRadius, opts.border.color), insertBefore);

        if (!opts.transparentBg) {
            svg.insertBefore(createRoundedRect(inner, innerRadius, opts.backgroundColor), insertBefore);
        }

        addFillerDots(svg, opts, inner, innerRadius, qrBounds, insertBefore);

        if (opts.border.dash.trim()) {
            svg.appendChild(createDashedStroke(opts, outer, thickness, outerRadius));
        }

        addDecoration(svg, "top", opts.border.decoTop, width, height, thickness);
        addDecoration(svg, "bottom", opts.border.decoBottom, width, height, thickness);
        addDecoration(svg, "left", opts.border.decoLeft, width, height, thickness);
        addDecoration(svg, "right", opts.border.decoRight, width, height, thickness);
    };
}

function addFillerDots(
    svg: SVGElement,
    opts: QRState,
    inner: Bounds,
    innerRadius: number,
    qrBounds: Bounds,
    insertBefore: ChildNode | null
): void {
    const moduleSize = Math.max(2, estimateModuleSize(svg, qrBounds));
    const gap = moduleSize;
    const quiet = Math.max(1, Math.min(opts.margin, moduleSize * 0.5));
    const protectedQR = expandBounds(qrBounds, quiet);
    const color = resolveSolidColor(opts.dotColor);
    const group = createSvgElement("g");
    group.setAttribute("fill", color);
    group.setAttribute("pointer-events", "none");

    const dotSize = Math.max(1, moduleSize * 0.62);
    let index = 0;

    for (let y = inner.y + gap; y <= inner.y + inner.height - gap; y += gap) {
        for (let x = inner.x + gap; x <= inner.x + inner.width - gap; x += gap) {
            if (isInsideBounds({ x, y }, protectedQR)) continue;
            if (!isInsideRoundedBounds({ x, y }, inner, innerRadius)) continue;
            if (!shouldPlaceFillerDot(x, y, index)) {
                index += 1;
                continue;
            }

            const dot = createSvgElement("rect");
            dot.setAttribute("x", String(x - dotSize / 2));
            dot.setAttribute("y", String(y - dotSize / 2));
            dot.setAttribute("width", String(dotSize));
            dot.setAttribute("height", String(dotSize));
            dot.setAttribute("rx", String(dotSize * 0.25));
            dot.setAttribute("ry", String(dotSize * 0.25));
            group.appendChild(dot);
            index += 1;
        }
    }

    if (group.children.length > 0) {
        svg.insertBefore(group, insertBefore);
    }
}

function shouldPlaceFillerDot(x: number, y: number, index: number): boolean {
    const noise = Math.sin(x * 12.9898 + y * 78.233 + index * 37.719) * 43758.5453;
    return noise - Math.floor(noise) > 0.42;
}

function createRoundedRect(bounds: Bounds, radius: number, fill: string): SVGRectElement {
    const rect = createSvgElement("rect");
    rect.setAttribute("x", String(bounds.x));
    rect.setAttribute("y", String(bounds.y));
    rect.setAttribute("width", String(bounds.width));
    rect.setAttribute("height", String(bounds.height));
    rect.setAttribute("rx", String(radius));
    rect.setAttribute("ry", String(radius));
    rect.setAttribute("fill", fill);
    rect.setAttribute("pointer-events", "none");
    return rect;
}

function createDashedStroke(opts: QRState, bounds: Bounds, thickness: number, outerRadius: number): SVGRectElement {
    const inset = thickness / 2;
    const strokeBounds = insetBounds(bounds, inset);
    const stroke = createSvgElement("rect");
    stroke.setAttribute("x", String(strokeBounds.x));
    stroke.setAttribute("y", String(strokeBounds.y));
    stroke.setAttribute("width", String(strokeBounds.width));
    stroke.setAttribute("height", String(strokeBounds.height));
    stroke.setAttribute("rx", String(Math.max(0, outerRadius - inset)));
    stroke.setAttribute("ry", String(Math.max(0, outerRadius - inset)));
    stroke.setAttribute("fill", "none");
    stroke.setAttribute("stroke", opts.border.color);
    stroke.setAttribute("stroke-width", String(thickness));
    stroke.setAttribute("stroke-dasharray", opts.border.dash);
    stroke.setAttribute("pointer-events", "none");
    return stroke;
}

function getQRContentBounds(svg: SVGElement): Bounds {
    const selectors = [
        "clipPath[id^='clip-path-dot-color'] *",
        "clipPath[id^='clip-path-corners-square-color'] *",
        "clipPath[id^='clip-path-corners-dot-color'] *",
    ];
    const boxes = Array.from(svg.querySelectorAll(selectors.join(", ")))
        .map(getElementBounds)
        .filter((box): box is Bounds => !!box && box.width > 0 && box.height > 0);

    if (!boxes.length) {
        return {
            x: 0,
            y: 0,
            width: readSize(svg, "width"),
            height: readSize(svg, "height"),
        };
    }

    const x = Math.min(...boxes.map((box) => box.x));
    const y = Math.min(...boxes.map((box) => box.y));
    const right = Math.max(...boxes.map((box) => box.x + box.width));
    const bottom = Math.max(...boxes.map((box) => box.y + box.height));
    return { x, y, width: right - x, height: bottom - y };
}

function getElementBounds(element: Element): Bounds | null {
    if (element instanceof SVGRectElement) {
        return {
            x: readNumberAttr(element, "x"),
            y: readNumberAttr(element, "y"),
            width: readNumberAttr(element, "width"),
            height: readNumberAttr(element, "height"),
        };
    }

    if (element instanceof SVGCircleElement) {
        const radius = readNumberAttr(element, "r");
        return {
            x: readNumberAttr(element, "cx") - radius,
            y: readNumberAttr(element, "cy") - radius,
            width: radius * 2,
            height: radius * 2,
        };
    }

    if (element instanceof SVGPathElement) {
        return getPathBounds(element.getAttribute("d") ?? "");
    }

    return null;
}

function getPathBounds(pathData: string): Bounds | null {
    const match = pathData.match(/M\s*([\d.]+)\s+([\d.]+)\s*v\s*([\d.-]+)\s*h\s*([\d.-]+)/i);
    if (!match) return null;

    return {
        x: Number.parseFloat(match[1]),
        y: Number.parseFloat(match[2]),
        height: Math.abs(Number.parseFloat(match[3])),
        width: Math.abs(Number.parseFloat(match[4])),
    };
}

function estimateModuleSize(svg: SVGElement, fallback: Bounds): number {
    const rect = svg.querySelector("clipPath[id^='clip-path-dot-color'] rect");
    if (rect instanceof SVGRectElement) {
        const width = readNumberAttr(rect, "width");
        if (width > 0) return width;
    }

    return Math.max(2, Math.round(Math.min(fallback.width, fallback.height) / 29));
}

function centeredBounds(width: number, height: number, size: number): Bounds {
    return {
        x: (width - size) / 2,
        y: (height - size) / 2,
        width: size,
        height: size,
    };
}

function insetBounds(bounds: Bounds, inset: number): Bounds {
    return {
        x: bounds.x + inset,
        y: bounds.y + inset,
        width: Math.max(0, bounds.width - inset * 2),
        height: Math.max(0, bounds.height - inset * 2),
    };
}

function expandBounds(bounds: Bounds, padding: number): Bounds {
    return {
        x: bounds.x - padding,
        y: bounds.y - padding,
        width: bounds.width + padding * 2,
        height: bounds.height + padding * 2,
    };
}

function isInsideBounds(point: { x: number; y: number }, bounds: Bounds): boolean {
    return (
        point.x >= bounds.x &&
        point.y >= bounds.y &&
        point.x <= bounds.x + bounds.width &&
        point.y <= bounds.y + bounds.height
    );
}

function isInsideRoundedBounds(point: { x: number; y: number }, bounds: Bounds, radius: number): boolean {
    if (radius <= 0) return isInsideBounds(point, bounds);

    const left = bounds.x;
    const right = bounds.x + bounds.width;
    const top = bounds.y;
    const bottom = bounds.y + bounds.height;
    if (!isInsideBounds(point, bounds)) return false;

    const cornerX = point.x < left + radius ? left + radius : point.x > right - radius ? right - radius : point.x;
    const cornerY = point.y < top + radius ? top + radius : point.y > bottom - radius ? bottom - radius : point.y;
    return Math.hypot(point.x - cornerX, point.y - cornerY) <= radius;
}

function resolveSolidColor(config: ColorConfig): string {
    return config.mode === "solid" ? config.solid : config.gradient.color1;
}

function addDecoration(
    svg: SVGElement,
    position: DecorationPosition,
    side: DecorationSide,
    width: number,
    height: number,
    thickness: number
): void {
    if (!side.enabled || !side.text.trim()) return;

    const text = createSvgElement("text");
    text.textContent = side.text;
    text.setAttribute("fill", side.color);
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-size", String(side.fontSize));
    text.setAttribute("font-weight", side.bold ? "700" : "400");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("pointer-events", "none");

    const sideCenter = thickness / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    switch (position) {
        case "top":
            text.setAttribute("x", String(centerX));
            text.setAttribute("y", String(sideCenter));
            break;
        case "bottom":
            text.setAttribute("x", String(centerX));
            text.setAttribute("y", String(height - sideCenter));
            break;
        case "left":
            text.setAttribute("x", String(sideCenter));
            text.setAttribute("y", String(centerY));
            text.setAttribute("transform", `rotate(-90 ${sideCenter} ${centerY})`);
            break;
        case "right":
            text.setAttribute("x", String(width - sideCenter));
            text.setAttribute("y", String(centerY));
            text.setAttribute("transform", `rotate(90 ${width - sideCenter} ${centerY})`);
            break;
    }

    svg.appendChild(text);
}

function readSize(svg: SVGElement, attr: "width" | "height", fallback = 0): number {
    const raw = svg.getAttribute(attr);
    const parsed = raw ? Number.parseFloat(raw) : fallback;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readNumberAttr(element: Element, attr: string): number {
    return Number.parseFloat(element.getAttribute(attr) ?? "0") || 0;
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K): SVGElementTagNameMap[K] {
    return document.createElementNS(SVG_NS, tagName);
}

function getOrCreateDefs(svg: SVGElement): SVGDefsElement {
    const existingDefs = svg.querySelector(":scope > defs");
    if (existingDefs) return existingDefs;

    const defs = createSvgElement("defs");
    svg.insertBefore(defs, svg.firstChild);
    return defs;
}

function getEffectiveThickness(thickness: number, size: number): number {
    return Math.min(thickness, Math.max(0, Math.floor(size * 0.35)));
}

function deleteExtension(qrInstance: QRCodeStyling): void {
    try {
        qrInstance.deleteExtension();
    } catch {
        // qr-code-styling throws when no extension has been registered yet.
    }
}
