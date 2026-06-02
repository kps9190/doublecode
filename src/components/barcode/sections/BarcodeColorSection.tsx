import type { BarcodeState } from "../../../types";
import { InlineColorControl, LabeledSwitch, ToolbarSeparator } from "../../ui";
import { useRestorableBackgroundColor } from "../../code";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     BarcodeState;
    onChange: (patch: Partial<BarcodeState>) => void;
}

/** 바코드 색·배경 색·투명 배경 설정 섹션 */
export default function BarcodeColorSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const { lastColor } = useRestorableBackgroundColor(opts.background, opts.transparentBg);

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 py-2.5 last:border-b-0 dark:border-slate-700">
            <span className="grow-0 shrink-0 basis-36 text-xs font-semibold uppercase tracking-widest text-slate-500 md:basis-2/5 dark:text-slate-500">
                {t("common.color")}
            </span>
            <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap">
                <InlineColorControl
                    label={t("barcode.colorShort")}
                    value={opts.lineColor}
                    ariaLabel={t("barcode.color")}
                    onChange={(lineColor) => onChange({ lineColor })}
                />
                <ToolbarSeparator />
                <div className="flex shrink-0 flex-nowrap items-center gap-2">
                    {opts.transparentBg ? (
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("common.backgroundShort")}
                        </span>
                    ) : (
                        <InlineColorControl
                            label={t("common.backgroundShort")}
                            value={opts.background}
                            ariaLabel={t("common.backgroundColor")}
                            onChange={(background) => onChange({ background })}
                        />
                    )}
                    <LabeledSwitch
                        checked={opts.transparentBg}
                        label={t("common.transparentShort")}
                        ariaLabel={t("common.transparentBackground")}
                        onChange={(transparentBg) => {
                            if (transparentBg) onChange({ transparentBg: true, background: "transparent" });
                            else               onChange({ transparentBg: false, background: lastColor });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
