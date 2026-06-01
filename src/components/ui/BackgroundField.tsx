interface Props {
    label: string;
    color: string;
    transparent: boolean;
    transparentLabel: string;
    onColorChange: (color: string) => void;
    onTransparentChange: (transparent: boolean) => void;
}

const COMPACT_SWITCH_WIDTH_CLASS = "w-16";
const COMPACT_SWITCH_KNOB_ON_CLASS = "translate-x-9";
const WIDE_SWITCH_WIDTH_CLASS = "w-[4.75rem]";
const WIDE_SWITCH_KNOB_ON_CLASS = "translate-x-11";

export default function BackgroundField({
    label,
    color,
    transparent,
    transparentLabel,
    onColorChange,
    onTransparentChange,
}: Props) {
    const isCompactSwitch = transparentLabel.length <= 2;
    const switchWidthClass = isCompactSwitch ? COMPACT_SWITCH_WIDTH_CLASS : WIDE_SWITCH_WIDTH_CLASS;
    const switchKnobOnClass = isCompactSwitch ? COMPACT_SWITCH_KNOB_ON_CLASS : WIDE_SWITCH_KNOB_ON_CLASS;

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 py-2.5 last:border-b-0 dark:border-slate-700">
            <div className="grow-0 shrink-0 basis-36 text-sm font-medium text-slate-700 dark:text-slate-300 md:basis-2/5">
                {label}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {!transparent && (
                    <>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-transparent p-0.5 dark:border-slate-600"
                        />
                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
                    </>
                )}
                <button
                    type="button"
                    role="switch"
                    aria-checked={transparent}
                    onClick={() => onTransparentChange(!transparent)}
                    className={`relative inline-flex h-8 ${switchWidthClass} shrink-0 items-center rounded-full border transition-colors ${
                        transparent
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                >
                    <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                            transparent ? switchKnobOnClass : "translate-x-1"
                        }`}
                    />
                    <span className={`relative z-10 w-full whitespace-nowrap px-1.5 text-xs font-bold ${
                        transparent ? "translate-x-px text-left" : "-translate-x-0.5 text-right"
                    }`}>
                        {transparentLabel}
                    </span>
                </button>
            </div>
        </div>
    );
}
