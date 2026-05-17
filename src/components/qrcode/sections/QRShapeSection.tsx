import type { QRState, DotCornerStyle } from "../../../types";
import { QR_DOT_STYLES, QR_CORNER_SQUARE_STYLES, QR_CORNER_DOT_STYLES } from "../../../constants";
import { SelectField, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

/** QR 점·모서리 사각형·모서리 점 모양 설정 섹션 */
export default function QRShapeSection({ opts, onChange }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{t("qr.shapeSettings")}</SectionTitle>
            <SelectField label={t("qr.dotShape")}       value={opts.dotStyle}          options={QR_DOT_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }))}           onChange={(v) => onChange({ dotStyle: v as DotCornerStyle })} />
            <SelectField label={t("qr.cornerSquare")} value={opts.cornerSquareStyle} options={QR_CORNER_SQUARE_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }))} onChange={(v) => onChange({ cornerSquareStyle: v as DotCornerStyle })} />
            <SelectField label={t("qr.cornerDot")}     value={opts.cornerDotStyle}    options={QR_CORNER_DOT_STYLES.map((o) => ({ value: o.value, label: t(o.labelKey) }))}    onChange={(v) => onChange({ cornerDotStyle: v as DotCornerStyle })} />
        </>
    );
}
