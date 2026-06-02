import { useI18n } from "../../i18n";
import { FieldRow, RangeField, SectionTitle, SegmentSelect, SelectField, TextStyleField, Toggle } from "../ui";
import CodeTextOverrideInput from "./CodeTextOverrideInput";

type CodeTextAlign = "left" | "center" | "right";
type CodeTextPosition = "bottom" | "top";

export interface CodeTextSettings {
    useTextOverride: boolean;
    textOverride: string;
    textAlign: CodeTextAlign;
    textPosition: CodeTextPosition;
    font: string;
    bold: boolean;
    italic: boolean;
    fontSize: number;
    textMargin: number;
    textColor?: string;
}

interface Option {
    value: string;
    label: string;
}

interface Props {
    fontOptions: readonly Option[];
    idPrefix: string;
    value: CodeTextSettings;
    textMarginMin: number;
    onChange: (patch: Partial<CodeTextSettings>) => void;
}

export default function CodeTextSection({ fontOptions, idPrefix, value, textMarginMin, onChange }: Props) {
    const { t } = useI18n();
    const textAlignOptions = [
        { value: "left", label: t("common.left") },
        { value: "center", label: t("common.center") },
        { value: "right", label: t("common.right") },
    ] as const;
    const textPositionOptions = [
        { value: "bottom", label: t("common.bottom") },
        { value: "top", label: t("common.top") },
    ] as const;

    return (
        <>
            <SectionTitle>{t("common.textSettings")}</SectionTitle>
            <Toggle
                label={t("common.overrideText")}
                checked={value.useTextOverride}
                onChange={(useTextOverride) => onChange({ useTextOverride })}
            />
            {value.useTextOverride && (
                <FieldRow label={t("common.displayText")}>
                    <CodeTextOverrideInput
                        value={value.textOverride}
                        onChange={(textOverride) => onChange({ textOverride })}
                    />
                </FieldRow>
            )}
            <FieldRow label={t("common.horizontal")}>
                <SegmentSelect
                    value={value.textAlign}
                    options={textAlignOptions}
                    onChange={(textAlign) => onChange({ textAlign: textAlign as CodeTextAlign })}
                />
            </FieldRow>
            <FieldRow label={t("common.vertical")}>
                <SegmentSelect
                    value={value.textPosition}
                    options={textPositionOptions}
                    onChange={(textPosition) => onChange({ textPosition: textPosition as CodeTextPosition })}
                />
            </FieldRow>
            <SelectField
                label={t("common.font")}
                value={value.font}
                options={fontOptions}
                onChange={(font) => onChange({ font })}
            />
            <TextStyleField
                label={t("common.textStyle")}
                boldChecked={value.bold}
                italicChecked={value.italic}
                onBoldChange={(bold) => onChange({ bold })}
                onItalicChange={(italic) => onChange({ italic })}
                color={value.textColor}
                onColorChange={(textColor) => onChange({ textColor })}
            />
            <RangeField
                id={`${idPrefix}-fs`}
                label={t("common.textSize")}
                min={8}
                max={60}
                value={value.fontSize}
                onChange={(fontSize) => onChange({ fontSize })}
            />
            <RangeField
                id={`${idPrefix}-tm`}
                label={t("common.textMargin")}
                min={textMarginMin}
                max={40}
                value={value.textMargin}
                onChange={(textMargin) => onChange({ textMargin })}
            />
        </>
    );
}
