import type { BarcodeState } from "../../../types";
import { BackgroundField, ColorField, SectionTitle } from "../../ui";
import { useRestorableBackgroundColor } from "../../code";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 바코드 색·배경 색·투명 배경 설정 섹션 */
export default function BarcodeColorSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const { lastColor } = useRestorableBackgroundColor(opts.background, opts.transparentBg);

    return (
        <>
            <SectionTitle>{t("common.color")}</SectionTitle>
            <ColorField
                label={t("barcode.color")}
                value={opts.lineColor}
                onChange={(lineColor) => onChange({ lineColor })}
            />
            <BackgroundField
                label={t("common.backgroundColor")}
                color={opts.background}
                transparent={opts.transparentBg}
                transparentLabel={t("common.transparentShort")}
                onColorChange={(background) => onChange({ background })}
                onTransparentChange={(transparentBg) => {
                    if (transparentBg) onChange({ transparentBg: true, background: "transparent" });
                    else               onChange({ transparentBg: false, background: lastColor });
                }}
            />
        </>
    );
}
