import type { QRBorderState, DecorationSide } from "../../../types";
import { FieldRow, RangeField, Toggle, ColorField, SectionTitle } from "../../ui";
import { isQRBorderPluginEnabled } from "../../../utils";
import DecorationSideBlock from "../border/DecorationSideBlock";
import { useI18n } from "../../../i18n";

interface Props {
    border:   QRBorderState;
    onChange: (patch: Partial<QRBorderState>) => void;
}

const SIDES = [
    { key: "decoTop",    label: "상단" },
    { key: "decoBottom", label: "하단" },
    { key: "decoLeft",   label: "좌측" },
    { key: "decoRight",  label: "우측" },
] as const;

/**
 * QR 테두리 설정 섹션 — Card 없이 QROptions 안에서 사용한다.
 * 글자 설정처럼 Toggle 하나로 전체 열기/닫기.
 */
export default function QRBorderSection({ border, onChange }: Props) {
    const { t } = useI18n();
    const set     = (patch: Partial<QRBorderState>) => onChange(patch);
    const setDeco = (key: typeof SIDES[number]["key"], patch: Partial<DecorationSide>) =>
        onChange({ [key]: { ...border[key], ...patch } });

    return (
        <>
            <SectionTitle>{t("qr.border")}</SectionTitle>
            {!isQRBorderPluginEnabled && (
                <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                    {t("qr.borderDisabled")}
                </div>
            )}
            {isQRBorderPluginEnabled && (
                <Toggle label={t("qr.useBorder")} checked={border.enabled} onChange={(v) => set({ enabled: v })} />
            )}

            {isQRBorderPluginEnabled && border.enabled && (
                <>
                    <RangeField id="br-thick" label={t("qr.borderThickness")}      min={10} max={120}           value={border.thickness} onChange={(v) => set({ thickness: v })} />
                    <RangeField id="br-round" label={t("qr.borderRound")} min={0}  max={1}  step={0.05} value={border.round}    onChange={(v) => set({ round: v })} />
                    <ColorField label={t("qr.borderColor")} value={border.color} onChange={(v) => set({ color: v })} />
                    <FieldRow label={t("qr.dashPattern")}>
                        <input
                            type="text" value={border.dash}
                            placeholder={t("qr.dashPlaceholder")}
                            onChange={(e) => set({ dash: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-2 h-8 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                    </FieldRow>

                    <SectionTitle>{t("qr.decorationText")}</SectionTitle>
                    {SIDES.map(({ key, label }) => (
                        <DecorationSideBlock
                            key={key}
                            label={label}
                            side={border[key]}
                            onChange={(patch) => setDeco(key, patch)}
                        />
                    ))}
                </>
            )}
        </>
    );
}
