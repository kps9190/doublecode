import type { QRState } from "../../../types";
import { EC_LEVELS, QR_MODES } from "../../../constants";
import { RangeField, SegmentSelect, SelectField, FieldRow, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:            QRState;
    onChange:        (patch: Partial<QRState>) => void;
    onForceRecreate: () => void;
}

/** QR 크기·여백·오류정정 수준·모드 설정 섹션 */
export default function QRBasicSection({ opts, onChange, onForceRecreate }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{t("common.basic")}</SectionTitle>
            <RangeField
                id="qr-size" label={t("qr.size")} min={50} max={600} step={10} value={opts.width}
                onChange={(v) => { onChange({ width: v, height: v }); onForceRecreate(); }}
            />
            <RangeField id="qr-mg" label={t("qr.margin")} min={0} max={50} value={opts.margin} onChange={(v) => onChange({ margin: v })} />
            <FieldRow label={t("qr.errorCorrection")}>
                <SegmentSelect
                    value={opts.errorCorrectionLevel}
                    options={EC_LEVELS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                    onChange={(v) => onChange({ errorCorrectionLevel: v as QRState["errorCorrectionLevel"] })}
                />
            </FieldRow>
            <SelectField
                label={t("qr.mode")}
                value={opts.mode}
                options={QR_MODES.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                onChange={(v) => {
                    onChange({ mode: v as QRState["mode"] });
                    onForceRecreate();
                }}
            />
        </>
    );
}
