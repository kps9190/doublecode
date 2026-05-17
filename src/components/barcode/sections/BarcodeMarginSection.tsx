import type { BarcodeState } from "../../../types";
import { RangeField, Toggle, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 배경 간격 설정 섹션 (일괄 / 상·하·좌·우 상세 조절) */
export default function BarcodeMarginSection({ opts, onChange }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{t("barcode.marginSection")}</SectionTitle>
            <Toggle
                label={t("barcode.detailedMargin")}
                checked={opts.useDetailedMargin}
                onChange={(v) => onChange({ useDetailedMargin: v })}
            />
            {opts.useDetailedMargin ? (
                <>
                    <RangeField id="mt" label={t("common.up")}     min={0} max={100} value={opts.marginTop}    onChange={(v) => onChange({ marginTop: v })} />
                    <RangeField id="mb" label={t("common.down")}   min={0} max={100} value={opts.marginBottom} onChange={(v) => onChange({ marginBottom: v })} />
                    <RangeField id="ml" label={t("common.left")}   min={0} max={100} value={opts.marginLeft}   onChange={(v) => onChange({ marginLeft: v })} />
                    <RangeField id="mr" label={t("common.right")} min={0} max={100} value={opts.marginRight}  onChange={(v) => onChange({ marginRight: v })} />
                </>
            ) : (
                <RangeField id="bc-margin" label={t("barcode.margin")} min={0} max={100} value={opts.margin} onChange={(v) => onChange({ margin: v })} />
            )}
        </>
    );
}
