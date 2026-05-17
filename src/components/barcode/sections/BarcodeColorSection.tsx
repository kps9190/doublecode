import { useEffect, useRef } from "react";
import type { BarcodeState } from "../../../types";
import { ColorField, Toggle, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 바코드 색·배경 색·투명 배경 설정 섹션 */
export default function BarcodeColorSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    // 투명으로 전환하기 전 마지막 배경색 기억
    const lastBgRef = useRef(opts.background);
    useEffect(() => {
        if (!opts.transparentBg) lastBgRef.current = opts.background;
    }, [opts.transparentBg, opts.background]);

    return (
        <>
            <SectionTitle>{t("common.color")}</SectionTitle>
            <ColorField label={t("barcode.color")} value={opts.lineColor} onChange={(v) => onChange({ lineColor: v })} />
            <Toggle
                label={t("common.transparentBackground")}
                checked={opts.transparentBg}
                onChange={(v) => {
                    if (v) onChange({ transparentBg: true, background: "transparent" });
                    else   onChange({ transparentBg: false, background: lastBgRef.current });
                }}
            />
            {!opts.transparentBg && (
                <ColorField label={t("barcode.backgroundColor")} value={opts.background} onChange={(v) => onChange({ background: v })} />
            )}
        </>
    );
}
