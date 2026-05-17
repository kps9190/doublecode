import type { QRState } from "../../../types";
import { ColorField, Toggle, SectionTitle } from "../../ui";
import ColorSection from "../ColorSection";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

/** QR 점·모서리 색상 + 배경색 설정 섹션 */
export default function QRColorGroup({ opts, onChange }: Props) {
    const { t } = useI18n();

    return (
        <>
            <SectionTitle>{t("common.color")}</SectionTitle>
            <ColorSection label={t("qr.dotColor")}          cfg={opts.dotColor}          onChange={(v) => onChange({ dotColor: v })} />
            <ColorSection label={t("qr.cornerSquareColor")}  cfg={opts.cornerSquareColor} onChange={(v) => onChange({ cornerSquareColor: v })} />
            <ColorSection label={t("qr.cornerDotColor")}     cfg={opts.cornerDotColor}    onChange={(v) => onChange({ cornerDotColor: v })} />
            <Toggle label={t("common.transparentBackground")} checked={opts.transparentBg} onChange={(v) => onChange({ transparentBg: v })} />
            {!opts.transparentBg && (
                <ColorField label={t("common.backgroundColor")} value={opts.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
            )}
        </>
    );
}
