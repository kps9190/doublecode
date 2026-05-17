import { useState } from "react";
import type { ColorConfig, QRState } from "../../../types";
import { AdvancedSectionHeader, BackgroundField } from "../../ui";
import ColorSection from "../ColorSection";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

function cloneColorConfig(color: ColorConfig): ColorConfig {
    return {
        ...color,
        gradient: { ...color.gradient },
    };
}

/** QR 점·모서리 색상 + 배경색 설정 섹션 */
export default function QRColorGroup({ opts, onChange }: Props) {
    const { t } = useI18n();
    const [advanced, setAdvanced] = useState(false);
    const setAllColors = (color: QRState["dotColor"]) =>
        onChange({
            dotColor: color,
            cornerSquareColor: cloneColorConfig(color),
            cornerDotColor: cloneColorConfig(color),
        });

    return (
        <>
            <AdvancedSectionHeader
                title={t("common.color")}
                advanced={advanced}
                label={t("common.advanced")}
                onToggle={() => setAdvanced((v) => !v)}
            />
            {!advanced ? (
                <ColorSection label={t("qr.allColor")} cfg={opts.dotColor} onChange={setAllColors} />
            ) : (
                <div className="grid gap-2 lg:grid-cols-3">
                    <ColorSection compact label={t("qr.dotColor")}          cfg={opts.dotColor}          onChange={(v) => onChange({ dotColor: v })} />
                    <ColorSection compact label={t("qr.cornerSquareColor")} cfg={opts.cornerSquareColor} onChange={(v) => onChange({ cornerSquareColor: v })} />
                    <ColorSection compact label={t("qr.cornerDotColor")}    cfg={opts.cornerDotColor}    onChange={(v) => onChange({ cornerDotColor: v })} />
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
