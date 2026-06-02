import { useState } from "react";
import {
    BORDER_STYLE_DASH,
    BORDER_STYLE_OPTIONS,
    type BorderStyle,
    clampDashValue,
    getBorderStyleValue,
    parseDashValues,
} from "../../../domain/qrcode/borderStyle";
import { useI18n } from "../../../i18n";
import { FieldRow } from "../../ui";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function BorderStyleField({ value, onChange }: Props) {
    const [advanced, setAdvanced] = useState(false);
    const { t } = useI18n();
    const dashValues = parseDashValues(value);
    const setDashValue = (nextLength: number, nextGap: number) => {
        onChange(`${clampDashValue(nextLength, dashValues.length, 1)},${clampDashValue(nextGap, dashValues.gap)}`);
    };

    return (
        <FieldRow label={t("qr.borderStyle")}>
            <div className="flex flex-wrap items-center gap-2">
                {advanced ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {t("qr.borderDashLength")}
                            <input
                                type="number"
                                min={1}
                                max={99}
                                value={dashValues.length}
                                onChange={(event) => setDashValue(parseInt(event.target.value, 10), dashValues.gap)}
                                className="h-8 w-14 rounded-lg border border-slate-300 bg-white px-2 text-right text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </label>
                        <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {t("qr.borderDashGap")}
                            <input
                                type="number"
                                min={0}
                                max={99}
                                value={dashValues.gap}
                                onChange={(event) => setDashValue(dashValues.length, parseInt(event.target.value, 10))}
                                className="h-8 w-14 rounded-lg border border-slate-300 bg-white px-2 text-right text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </label>
                    </div>
                ) : (
                    <select
                        value={getBorderStyleValue(value)}
                        onChange={(event) => onChange(BORDER_STYLE_DASH[event.target.value as BorderStyle])}
                        className="h-8 min-w-36 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    >
                        {BORDER_STYLE_OPTIONS.map(({ value: styleValue, labelKey }) => (
                            <option key={styleValue} value={styleValue}>{t(labelKey)}</option>
                        ))}
                    </select>
                )}
                <button
                    type="button"
                    onClick={() => setAdvanced((current) => !current)}
                    className={`h-8 rounded-lg px-2 text-xs font-semibold transition-colors ${
                        advanced
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                >
                    {t("common.advanced")}
                </button>
            </div>
        </FieldRow>
    );
}
