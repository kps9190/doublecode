import QRBorderPlugin, {
    DecorationType,
    Position,
    type ExtensionOptions,
} from "qr-border-plugin";
import type QRCodeStyling from "qr-code-styling";
import type { DecorationSide, QRBorderState } from "../../types";

export const isQRBorderPluginEnabled =
    import.meta.env.VITE_ENABLE_QR_BORDER_PLUGIN === "true";

let licenseKeyApplied = false;

export function applyQRBorderPlugin(
    qrInstance: QRCodeStyling | null,
    border: QRBorderState
): void {
    if (!qrInstance) return;

    if (!border.enabled || !isQRBorderPluginEnabled) {
        deleteExtension(qrInstance);
        return;
    }

    applyLicenseKey();
    qrInstance.applyExtension(QRBorderPlugin(toPluginOptions(border)));
}

function applyLicenseKey(): void {
    if (licenseKeyApplied) return;

    QRBorderPlugin.setKey(import.meta.env.VITE_QR_BORDER_PLUGIN_KEY);
    licenseKeyApplied = true;
}

function toPluginOptions(border: QRBorderState): ExtensionOptions {
    return {
        round: border.round,
        thickness: border.thickness,
        color: border.color,
        dasharray: border.dash,
        decorations: {
            [Position.top]: toDecoration(border.decoTop),
            [Position.bottom]: toDecoration(border.decoBottom),
            [Position.left]: toDecoration(border.decoLeft),
            [Position.right]: toDecoration(border.decoRight),
        },
        borderInner: {
            color: border.color,
            thickness: 0,
            dasharray: "",
        },
        borderOuter: {
            color: border.color,
            thickness: 0,
            dasharray: "",
        },
    };
}

function toDecoration(side: DecorationSide) {
    return {
        type: DecorationType.text,
        value: side.enabled ? side.text : "",
        style: [
            `font: ${side.bold ? "bold " : ""}${side.fontSize}px sans-serif`,
            `fill: ${side.color}`,
        ].join("; "),
    };
}

function deleteExtension(qrInstance: QRCodeStyling): void {
    try {
        qrInstance.deleteExtension();
    } catch {
        // qr-code-styling throws when no extension has been registered yet.
    }
}
