import type { BarcodeState } from "../../../types";
import { FONT_FAMILIES } from "../../../constants";
import { FieldRow, RangeField, Toggle, SelectField, SegmentSelect, CheckboxPair, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 바코드 글자 표시·위치·폰트·크기·간격 설정 섹션 */
export default function BarcodeTextSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const textAlignOptions = [{ value: "left", label: t("common.left") }, { value: "center", label: t("common.center") }, { value: "right", label: t("common.right") }] as const;
    const textPositionOptions = [{ value: "bottom", label: t("common.bottom") }, { value: "top", label: t("common.top") }] as const;

    if (!opts.displayValue) return null;

    return (
        <>
            <SectionTitle>{t("common.textSettings")}</SectionTitle>
            <Toggle label={t("common.overrideText")} checked={opts.useTextOverride} onChange={(v) => onChange({ useTextOverride: v })} />
            {opts.useTextOverride && (
                <FieldRow label={t("common.displayText")}>
                    <input
                        type="text" value={opts.textOverride}
                        onChange={(e) => onChange({ textOverride: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-2 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </FieldRow>
            )}
            <FieldRow label={t("common.horizontal")}>
                <SegmentSelect value={opts.textAlign}    options={textAlignOptions}    onChange={(v) => onChange({ textAlign: v as BarcodeState["textAlign"] })} />
            </FieldRow>
            <FieldRow label={t("common.vertical")}>
                <SegmentSelect value={opts.textPosition} options={textPositionOptions} onChange={(v) => onChange({ textPosition: v as BarcodeState["textPosition"] })} />
            </FieldRow>
            <SelectField label={t("common.font")} value={opts.font} options={FONT_FAMILIES} onChange={(v) => onChange({ font: v as BarcodeState["font"] })} />
            <CheckboxPair
                label={t("common.textStyle")}
                boldChecked={opts.bold}     onBoldChange={(v) => onChange({ bold: v })}
                italicChecked={opts.italic} onItalicChange={(v) => onChange({ italic: v })}
            />
            <RangeField id="bc-fs" label={t("common.textSize")} min={8}   max={60} value={opts.fontSize}   onChange={(v) => onChange({ fontSize: v })} />
            <RangeField id="bc-tm" label={t("common.textMargin")} min={-10} max={40} value={opts.textMargin} onChange={(v) => onChange({ textMargin: v })} />
        </>
    );
}
