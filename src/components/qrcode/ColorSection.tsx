import type { ColorConfig } from "../../types";
import { useI18n } from "../../i18n";

interface Props {
    label: string;
    cfg: ColorConfig;
    onChange: (v: ColorConfig) => void;
    compact?: boolean;
}

export default function ColorSection({ label, cfg, onChange, compact = false }: Props) {
    const { t } = useI18n();
    const set     = (patch: Partial<ColorConfig>) => onChange({ ...cfg, ...patch });
    const setGrad = (patch: Partial<ColorConfig["gradient"]>) => onChange({ ...cfg, gradient: { ...cfg.gradient, ...patch } });

    return (
        <div className="border-b last:border-b-0 border-slate-200 py-2 dark:border-slate-700">
            <div className={`flex flex-wrap ${compact ? "items-start gap-2" : "items-center gap-3"}`}>
                <div className={`font-medium text-slate-700 dark:text-slate-300 grow-0 shrink-0 ${
                    compact ? "basis-full text-xs" : "basis-36 text-sm md:basis-2/5"
                }`}>{label}</div>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <label
                        onClick={() => set({ mode: "solid" })}
                        className={`relative inline-flex h-7 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border px-2.5 text-xs transition-colors ${
                            cfg.mode === "solid"
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                    >
                        <span className="h-3.5 w-3.5 rounded-full border border-white/70" style={{ background: cfg.solid }} />
                        {t("color.solid")}
                        <input
                            type="color"
                            value={cfg.solid}
                            onClick={() => set({ mode: "solid" })}
                            onFocus={() => set({ mode: "solid" })}
                            onChange={(e) => set({ mode: "solid", solid: e.target.value })}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => set({ mode: "gradient" })}
                        className={`h-7 rounded-lg border px-2.5 text-xs transition-colors ${
                            cfg.mode === "gradient"
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                    >
                        {t("color.gradient")}
                    </button>
                    {cfg.mode === "gradient" && (
                        <>
                            <select
                                value={cfg.gradient.type}
                                onChange={(e) => setGrad({ type: e.target.value as ColorConfig["gradient"]["type"] })}
                                className="h-7 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                            >
                                <option value="linear">{t("color.linear")}</option>
                                <option value="radial">{t("color.radial")}</option>
                            </select>
                            <input type="color" value={cfg.gradient.color1} onChange={(e) => setGrad({ color1: e.target.value })} className="h-7 w-9 cursor-pointer rounded border border-slate-300 p-0.5 bg-transparent dark:border-slate-600" />
                            <input type="color" value={cfg.gradient.color2} onChange={(e) => setGrad({ color2: e.target.value })} className="h-7 w-9 cursor-pointer rounded border border-slate-300 p-0.5 bg-transparent dark:border-slate-600" />
                            <div className="flex min-w-36 flex-1 items-center gap-2">
                                <input type="range" min={0} max={360} value={cfg.gradient.rotation} onChange={(e) => setGrad({ rotation: Number(e.target.value) })} className="min-w-0 flex-1" />
                                <span className="w-8 text-right text-xs tabular-nums text-slate-600 dark:text-slate-400">{cfg.gradient.rotation}°</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
