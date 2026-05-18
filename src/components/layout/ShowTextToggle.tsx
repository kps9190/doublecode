import Checkbox from "../ui/Checkbox";
import { useI18n } from "../../i18n";
interface Props { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }
export default function ShowTextToggle({ checked, onChange, disabled = false }: Props) {
    const { t } = useI18n();

    return (
        <div className="flex justify-center">
            <Checkbox label={t("common.showText")} checked={checked} disabled={disabled} onChange={onChange} />
        </div>
    );
}
