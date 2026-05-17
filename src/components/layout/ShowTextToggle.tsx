import Checkbox from "../ui/Checkbox";
import { useI18n } from "../../i18n";
interface Props { checked: boolean; onChange: (v: boolean) => void }
export default function ShowTextToggle({ checked, onChange }: Props) {
    const { t } = useI18n();

    return (
        <div className="flex justify-center">
            <Checkbox label={t("common.showText")} checked={checked} onChange={onChange} />
        </div>
    );
}
