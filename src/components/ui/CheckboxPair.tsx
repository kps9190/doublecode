import Checkbox from "./Checkbox";
import FieldRow from "./FieldRow";
import { useI18n } from "../../i18n";
interface Props { label: string; boldChecked: boolean; italicChecked: boolean; onBoldChange: (v: boolean) => void; onItalicChange: (v: boolean) => void }
export default function CheckboxPair({ label, boldChecked, italicChecked, onBoldChange, onItalicChange }: Props) {
    const { t } = useI18n();

    return (
        <FieldRow label={label}>
            <div className="flex gap-4">
                <Checkbox label={t("common.bold")} checked={boldChecked} onChange={onBoldChange} />
                <Checkbox label={t("common.italic")} checked={italicChecked} onChange={onItalicChange} />
            </div>
        </FieldRow>
    );
}
