import { useState } from "react";
import type { QRState, DotCornerStyle } from "../../../types";
import { QR_DOT_STYLES, QR_CORNER_SQUARE_STYLES, QR_CORNER_DOT_STYLES } from "../../../constants";
import { AdvancedSectionHeader, SelectField } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

function getUnifiedShapePatch(style: DotCornerStyle): Pick<QRState, "dotStyle" | "cornerSquareStyle" | "cornerDotStyle"> {
    if (style === "square") {
        return { dotStyle: "square", cornerSquareStyle: "square", cornerDotStyle: "square" };
    }

    if (style === "dots" || style === "dot") {
        return { dotStyle: "dots", cornerSquareStyle: "dot", cornerDotStyle: "dot" };
    }

    return {
        dotStyle: style,
        cornerSquareStyle: "extra-rounded",
        cornerDotStyle: "dot",
    };
}

/** QR 점·모서리 사각형·모서리 점 모양 설정 섹션 */
export default function QRShapeSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const [advanced, setAdvanced] = useState(false);
    const dotOptions = QR_DOT_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }));
    const cornerSquareOptions = QR_CORNER_SQUARE_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }));
    const cornerDotOptions = QR_CORNER_DOT_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }));

    const setAllShapes = (style: DotCornerStyle) => onChange(getUnifiedShapePatch(style));

    return (
        <>
            <AdvancedSectionHeader
                title={t("qr.shapeSettings")}
                advanced={advanced}
                label={t("common.advanced")}
                onToggle={() => setAdvanced((v) => !v)}
            />
            {!advanced ? (
                <SelectField label={t("qr.allShape")} value={opts.dotStyle} options={dotOptions} onChange={(v) => setAllShapes(v as DotCornerStyle)} />
            ) : (
                <div className="grid gap-2 lg:grid-cols-3">
                    <SelectField compact label={t("qr.dotShape")}     value={opts.dotStyle}          options={dotOptions}         onChange={(v) => onChange({ dotStyle: v as DotCornerStyle })} />
                    <SelectField compact label={t("qr.cornerSquare")} value={opts.cornerSquareStyle} options={cornerSquareOptions} onChange={(v) => onChange({ cornerSquareStyle: v as DotCornerStyle })} />
                    <SelectField compact label={t("qr.cornerDot")}    value={opts.cornerDotStyle}    options={cornerDotOptions}    onChange={(v) => onChange({ cornerDotStyle: v as DotCornerStyle })} />
                </div>
            )}
        </>
    );
}
