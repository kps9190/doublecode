import UIButton from "../ui/UIButton";
import type { CombinedInputState } from "../../hooks";
import { useI18n } from "../../i18n";

type Props = Pick<CombinedInputState,
    | "leftEnabled" | "rightEnabled"
    | "leftText" | "centerText" | "rightText"
    | "toggleLeft" | "toggleRight"
    | "setLeftText" | "setCenterText" | "setRightText"
> & { isInvalid?: boolean };

export default function CombinedInput({
    leftEnabled, rightEnabled,
    leftText, centerText, rightText,
    toggleLeft, toggleRight,
    setLeftText, setCenterText, setRightText,
    isInvalid = false,
}: Props) {
    const { t } = useI18n();
    const inputCount = (leftEnabled ? 1 : 0) + 1 + (rightEnabled ? 1 : 0);
    const gridCols = inputCount === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : inputCount === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1";

    const inputCls = "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

    return (
        <div className="space-y-3">
            <div className="mx-auto max-w-xs space-y-2">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">{t("input.add")}</p>
                <div className="grid grid-cols-2 gap-2">
                    <UIButton size="sm" variant={leftEnabled  ? "solid" : "outline"} onClick={toggleLeft}>{t("common.left")}</UIButton>
                    <UIButton size="sm" variant={rightEnabled ? "solid" : "outline"} onClick={toggleRight}>{t("common.right")}</UIButton>
                </div>
            </div>

            <div className={`grid ${gridCols} gap-2`}>
                {leftEnabled && (
                    <input type="text" value={leftText} onChange={(e) => setLeftText(e.target.value)}
                        placeholder={t("common.left")} className={inputCls} />
                )}
                <input type="text" value={centerText} onChange={(e) => setCenterText(e.target.value)}
                    placeholder={leftEnabled || rightEnabled ? t("common.center") : t("input.placeholder")}
                    className={inputCls} aria-invalid={isInvalid} />
                {rightEnabled && (
                    <input type="text" value={rightText} onChange={(e) => setRightText(e.target.value)}
                        placeholder={t("common.right")} className={inputCls} />
                )}
            </div>
        </div>
    );
}
