import type { BarcodeState } from "../../types";
import { Card } from "../ui";
import { useI18n } from "../../i18n";
import BarcodeFormatSection from "./sections/BarcodeFormatSection";
import BarcodeMarginSection from "./sections/BarcodeMarginSection";
import BarcodeColorSection  from "./sections/BarcodeColorSection";
import BarcodeTextSection   from "./sections/BarcodeTextSection";

interface Props { opts: BarcodeState; onChange: (patch: Partial<BarcodeState>) => void }

export default function BarcodeOptions({ opts, onChange }: Props) {
    const { t } = useI18n();

    return (
        <Card title={t("barcode.options")}>
            <BarcodeFormatSection opts={opts} onChange={onChange} />
            <BarcodeMarginSection opts={opts} onChange={onChange} />
            <BarcodeColorSection  opts={opts} onChange={onChange} />
            <BarcodeTextSection   opts={opts} onChange={onChange} />
        </Card>
    );
}
