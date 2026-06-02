import FieldRow from "./FieldRow";
import InlineColorControl from "./InlineColorControl";
import LabeledSwitch from "./LabeledSwitch";
import { useI18n } from "../../i18n";

interface Props {
    label: string;
    boldChecked: boolean;
    italicChecked: boolean;
    color?: string;
    onBoldChange: (value: boolean) => void;
    onItalicChange: (value: boolean) => void;
    onColorChange?: (value: string) => void;
}

export default function TextStyleField({
    label,
    boldChecked,
    italicChecked,
    color,
    onBoldChange,
    onItalicChange,
    onColorChange,
}: Props) {
    const { t } = useI18n();

    return (
        <FieldRow label={label}>
            <div className="flex flex-wrap items-center gap-2">
                <LabeledSwitch
                    checked={boldChecked}
                    label={t("common.bold")}
                    ariaLabel={t("common.bold")}
                    onChange={onBoldChange}
                />
                <LabeledSwitch
                    checked={italicChecked}
                    label={t("common.italic")}
                    ariaLabel={t("common.italic")}
                    onChange={onItalicChange}
                />
                {color !== undefined && onColorChange && (
                    <InlineColorControl
                        label={t("common.colorShort")}
                        value={color}
                        ariaLabel={t("common.textColor")}
                        onChange={onColorChange}
                    />
                )}
            </div>
        </FieldRow>
    );
}
