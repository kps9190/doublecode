import type { QRState } from "../../../types";
import { QR_FONT_FAMILIES } from "../../../constants";
import { FieldRow, RangeField, Toggle, ColorField, SelectField, SegmentSelect, CheckboxPair, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

/** QR 글자 표시·위치·폰트·색상 설정 섹션 */
export default function QRTextSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const textAlignOptions = [{ value: "left", label: t("common.left") }, { value: "center", label: t("common.center") }, { value: "right", label: t("common.right") }] as const;
    const textPositionOptions = [{ value: "bottom", label: t("common.bottom") }, { value: "top", label: t("common.top") }] as const;

    if (!opts.showText) return null;

    return (
        <>
            <SectionTitle>{t("common.textSettings")}</SectionTitle>
            <Toggle label={t("common.overrideText")} checked={opts.useTextOverride} onChange={(v) => onChange({ useTextOverride: v })} />
            {opts.useTextOverride && (
                <FieldRow label={t("common.displayText")}>
                    <input
                        type="text"
                        value={opts.textOverride}
                        onChange={(e) => onChange({ textOverride: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 h-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    />
                </FieldRow>
            )}
            <FieldRow label={t("common.horizontal")}>
                <SegmentSelect value={opts.textAlign}    options={textAlignOptions}    onChange={(v) => onChange({ textAlign: v as QRState["textAlign"] })} />
            </FieldRow>
            <FieldRow label={t("common.vertical")}>
                <SegmentSelect value={opts.textPosition} options={textPositionOptions} onChange={(v) => onChange({ textPosition: v as QRState["textPosition"] })} />
            </FieldRow>
            <SelectField
                label={t("common.font")}
                value={opts.font}
                options={QR_FONT_FAMILIES.map((f) => ({ value: f, label: f }))}
                onChange={(v) => onChange({ font: v })}
            />
            <CheckboxPair
                label={t("common.textStyle")}
                boldChecked={opts.bold}     onBoldChange={(v) => onChange({ bold: v })}
                italicChecked={opts.italic} onItalicChange={(v) => onChange({ italic: v })}
            />
            <RangeField id="qr-fs" label={t("common.textSize")} min={8}  max={60} value={opts.fontSize}   onChange={(v) => onChange({ fontSize: v })} />
            <RangeField id="qr-tm" label={t("common.textMargin")} min={0}  max={40} value={opts.textMargin} onChange={(v) => onChange({ textMargin: v })} />
            <ColorField label={t("common.textColor")} value={opts.textColor} onChange={(v) => onChange({ textColor: v })} />
        </>
    );
}
