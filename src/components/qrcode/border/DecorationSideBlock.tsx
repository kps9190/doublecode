import type { DecorationSide } from "../../../types";
import { ColorSwatchInput, FieldRow, RangeField, SectionTitle, LabeledSwitch } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    idPrefix: string;
    side:     DecorationSide;
    title:    string;
    defaultText: string;
    onChange: (patch: Partial<DecorationSide>) => void;
}

/**
 * 테두리 장식 텍스트 — 한 방향(상/하/좌/우)의 설정 블록.
 * QRBorderSection 에서 4번 사용한다.
 */
export default function DecorationSideBlock({ idPrefix, side, title, defaultText, onChange }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{title}</SectionTitle>
            <FieldRow label={t("qr.decorationContent")}>
                <div className="flex flex-wrap items-center gap-2">
                <input
                    id={`deco-${idPrefix}-content`}
                    type="text"
                    value={side.text}
                    placeholder={defaultText}
                    onChange={(e) => onChange({ text: e.target.value })}
                    className="h-8 min-w-24 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <ColorSwatchInput
                    value={side.color}
                    ariaLabel={t("qr.decorationColor")}
                    onChange={(color) => onChange({ color })}
                    className="h-8 w-9 shrink-0"
                />
                <LabeledSwitch
                    checked={side.bold}
                    label={t("qr.decorationBold")}
                    ariaLabel={t("qr.decorationBold")}
                    onChange={(v) => onChange({ bold: v })}
                />
                </div>
            </FieldRow>
            <RangeField
                id={`deco-${idPrefix}-fs`}
                label={t("qr.decorationFontSize")}
                min={8} max={60}
                value={side.fontSize}
                onChange={(v) => onChange({ fontSize: v })}
            />
        </>
    );
}
