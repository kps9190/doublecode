import type { QRBorderState, DecorationSide } from "../../../types";
import { InlineColorControl, RangeField, LabeledSwitch, ToolbarSeparator } from "../../ui";
import { isQRBorderEnabled } from "../../../utils";
import BorderStyleField from "../border/BorderStyleField";
import DecorationSideBlock from "../border/DecorationSideBlock";
import { useI18n } from "../../../i18n";

interface Props {
    border:   QRBorderState;
    onChange: (patch: Partial<QRBorderState>) => void;
}

const SIDES = [
    { key: "decoTop",    labelKey: "qr.decorationTop",    defaultTextKey: "qr.decorationDefaultTop",    arrow: "↑" },
    { key: "decoBottom", labelKey: "qr.decorationBottom", defaultTextKey: "qr.decorationDefaultBottom", arrow: "↓" },
    { key: "decoLeft",   labelKey: "qr.decorationLeft",   defaultTextKey: "qr.decorationDefaultLeft",   arrow: "←" },
    { key: "decoRight",  labelKey: "qr.decorationRight",  defaultTextKey: "qr.decorationDefaultRight",  arrow: "→" },
] as const;

const DEFAULT_DECORATION_TEXTS = [
    "", "SCAN ME",
    "Top Text", "Bottom Text", "Left Text", "Right Text",
    "상단 텍스트", "하단 텍스트", "좌측 텍스트", "우측 텍스트",
];

function isDefaultDecorationText(text: string) {
    return DEFAULT_DECORATION_TEXTS.includes(text.trim());
}

/**
 * QR 테두리 설정 섹션 — Card 없이 QROptions 안에서 사용한다.
 * 글자 설정처럼 Toggle 하나로 전체 열기/닫기.
 */
export default function QRBorderSection({ border, onChange }: Props) {
    const { t } = useI18n();
    const set     = (patch: Partial<QRBorderState>) => onChange(patch);
    const setDeco = (key: typeof SIDES[number]["key"], patch: Partial<DecorationSide>) => {
        const sideConfig = SIDES.find((side) => side.key === key);
        const nextSide = { ...border[key], ...patch };

        if (patch.enabled && sideConfig && isDefaultDecorationText(nextSide.text)) {
            nextSide.text = t(sideConfig.defaultTextKey);
        }

        onChange({ [key]: nextSide });
    };

    if (!isQRBorderEnabled) return null;

    return (
        <>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-slate-200 py-2.5 first:mt-1 dark:border-slate-700">
                <span className="grow-0 shrink-0 basis-36 text-xs font-semibold uppercase tracking-widest text-slate-500 md:basis-2/5 dark:text-slate-500">
                    {t("qr.border")}
                </span>
                <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <LabeledSwitch
                        checked={border.enabled}
                        label={border.enabled ? t("common.use") : t("common.disable")}
                        ariaLabel={t("qr.useBorder")}
                        onChange={(enabled) => set({ enabled })}
                    />
                    {border.enabled && (
                        <>
                            <ToolbarSeparator />
                            <InlineColorControl
                                label={t("common.colorShort")}
                                value={border.color}
                                ariaLabel={t("qr.borderColor")}
                                onChange={(color) => set({ color })}
                            />
                        </>
                    )}
                </div>
            </div>

            {border.enabled && (
                <>
                    <RangeField id="br-thick" label={t("qr.borderThickness")}      min={10} max={120}           value={border.thickness} onChange={(v) => set({ thickness: v })} />
                    <RangeField id="br-round" label={t("qr.borderRound")} min={0}  max={1}  step={0.05} value={border.round}    onChange={(v) => set({ round: v })} />
                    <BorderStyleField value={border.dash} onChange={(dash) => set({ dash })} />

                    <div className="flex items-center justify-between gap-3 py-2">
                        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            {t("qr.decorationText")}
                        </span>
                        <div className="flex flex-wrap justify-end gap-1">
                            {SIDES.map(({ key, labelKey, arrow }) => (
                                <LabeledSwitch
                                    key={key}
                                    checked={border[key].enabled}
                                    label={arrow}
                                    ariaLabel={`${t(labelKey)} ${t("qr.decorationUseText")}`}
                                    onChange={(checked) => setDeco(key, { enabled: checked })}
                                />
                            ))}
                        </div>
                    </div>
                    {SIDES.filter(({ key }) => border[key].enabled).map(({ key, labelKey, defaultTextKey }) => (
                        <DecorationSideBlock
                            key={key}
                            idPrefix={key}
                            side={border[key]}
                            onChange={(patch) => setDeco(key, patch)}
                            title={t(labelKey)}
                            defaultText={t(defaultTextKey)}
                        />
                    ))}
                </>
            )}
        </>
    );
}
