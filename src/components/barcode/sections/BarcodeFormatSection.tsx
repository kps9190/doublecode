import type { BarcodeState } from "../../../types";
import { BARCODE_FORMATS, EAN_FORMATS } from "../../../constants";
import { RangeField, SelectField, Toggle, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 바코드 유형·선 간격·높이·EAN flat 설정 섹션 */
export default function BarcodeFormatSection({ opts, onChange }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{t("common.basic")}</SectionTitle>
            <SelectField
                label={t("barcode.format")}
                value={opts.format}
                options={BARCODE_FORMATS}
                onChange={(v) => onChange({ format: v, isEAN: EAN_FORMATS.has(v) })}
            />
            <RangeField id="bc-width"  label={t("barcode.lineWidth")} min={1}  max={5}   step={0.5} value={opts.width}  onChange={(v) => onChange({ width: v })} />
            <RangeField id="bc-height" label={t("barcode.height")}    min={10} max={300}            value={opts.height} onChange={(v) => onChange({ height: v })} />
            {opts.isEAN && (
                <Toggle label={t("barcode.flat")} checked={opts.flat} onChange={(v) => onChange({ flat: v })} />
            )}
        </>
    );
}
