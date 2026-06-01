import type { QRTextDownloadOpts } from "../../types";

export function getQRDisplayText(opts: QRTextDownloadOpts, value: string): string {
    return opts.useTextOverride ? opts.textOverride : value;
}

export function clearQRContainer(container: HTMLElement | null): void {
    if (container) container.innerHTML = "";
}
