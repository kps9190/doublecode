import { useRef, useState } from "react";
import type { ColorConfig, QRState } from "../../../types";
import { applyColorToAllQRParts, cloneQRColorState, type QRColorKey, type QRColorState } from "../../../domain/qrcode/colorConfig";
import { AdvancedSectionHeader, BackgroundField } from "../../ui";
import ColorSection from "../ColorSection";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
    onForceRecreate: () => void;
}

/** QR 점·모서리 색상 + 배경색 설정 섹션 */
export default function QRColorGroup({ opts, onChange, onForceRecreate }: Props) {
    const { t } = useI18n();
    const [advanced, setAdvanced] = useState(false);
    const basicColorSnapshotRef = useRef<QRColorState | null>(null);
    const recreateIfModeChanged = (prev: ColorConfig, next: ColorConfig) => {
        if (prev.mode !== next.mode) onForceRecreate();
    };
    const recreateOnNextFrame = () => window.requestAnimationFrame(onForceRecreate);
    const toggleAdvanced = () => {
        if (advanced) {
            const snapshot = basicColorSnapshotRef.current;
            basicColorSnapshotRef.current = null;
            setAdvanced(false);

            if (!snapshot) return;
            onChange(cloneQRColorState(snapshot));
            recreateOnNextFrame();
            return;
        }

        basicColorSnapshotRef.current = cloneQRColorState(opts);
        setAdvanced(true);
    };
    const setAllColors = (color: QRState["dotColor"]) => {
        recreateIfModeChanged(opts.dotColor, color);
        onChange(applyColorToAllQRParts(color));
    };
    const setColor = (key: QRColorKey, color: ColorConfig) => {
        recreateIfModeChanged(opts[key], color);
        onChange({ [key]: color });
    };

    return (
        <>
            <AdvancedSectionHeader
                title={t("common.color")}
                advanced={advanced}
                label={t("common.advanced")}
                onToggle={toggleAdvanced}
            />
            {!advanced ? (
                <ColorSection label={t("qr.allColor")} cfg={opts.dotColor} onChange={setAllColors} />
            ) : (
                <div className="grid gap-2 lg:grid-cols-3">
                    <ColorSection compact label={t("qr.dotColor")}          cfg={opts.dotColor}          onChange={(v) => setColor("dotColor", v)} />
                    <ColorSection compact label={t("qr.cornerSquareColor")} cfg={opts.cornerSquareColor} onChange={(v) => setColor("cornerSquareColor", v)} />
                    <ColorSection compact label={t("qr.cornerDotColor")}    cfg={opts.cornerDotColor}    onChange={(v) => setColor("cornerDotColor", v)} />
                </div>
            )}
            <BackgroundField
                label={t("common.backgroundColor")}
                color={opts.backgroundColor}
                transparent={opts.transparentBg}
                transparentLabel={t("common.transparentShort")}
                onColorChange={(v) => onChange({ backgroundColor: v })}
                onTransparentChange={(v) => onChange({ transparentBg: v })}
            />
        </>
    );
}
