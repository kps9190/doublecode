interface Props {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
    hideLabel?: boolean;
    className?: string;
}

const ICON_SWITCH_WIDTH_CLASS = "w-11";
const ICON_SWITCH_KNOB_ON_CLASS = "translate-x-4";
const COMPACT_SWITCH_WIDTH_CLASS = "w-12";
const COMPACT_SWITCH_KNOB_ON_CLASS = "translate-x-5";
const DEFAULT_SWITCH_WIDTH_CLASS = "w-[4.75rem]";
const DEFAULT_SWITCH_KNOB_ON_CLASS = "translate-x-11";
const WIDE_SWITCH_WIDTH_CLASS = "w-[5.5rem]";
const WIDE_SWITCH_KNOB_ON_CLASS = "translate-x-[3.75rem]";
const COMPACT_LABELS = new Set(["↑", "↓", "←", "→"]);
const WIDE_LABELS = new Set(["비활성화", "Disable"]);

export default function LabeledSwitch({ checked, label, onChange, ariaLabel, hideLabel = false, className = "" }: Props) {
    const isCompactSwitch = !hideLabel && COMPACT_LABELS.has(label);
    const switchWidthClass = hideLabel
        ? ICON_SWITCH_WIDTH_CLASS
        : isCompactSwitch ? COMPACT_SWITCH_WIDTH_CLASS : WIDE_LABELS.has(label) ? WIDE_SWITCH_WIDTH_CLASS : DEFAULT_SWITCH_WIDTH_CLASS;
    const switchKnobOnClass = hideLabel
        ? ICON_SWITCH_KNOB_ON_CLASS
        : isCompactSwitch ? COMPACT_SWITCH_KNOB_ON_CLASS : WIDE_LABELS.has(label) ? WIDE_SWITCH_KNOB_ON_CLASS : DEFAULT_SWITCH_KNOB_ON_CLASS;

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-8 ${switchWidthClass} shrink-0 items-center rounded-full border transition-colors ${
                checked
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            } ${className}`}
        >
            <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    checked ? switchKnobOnClass : "translate-x-1"
                }`}
            />
            {!hideLabel && (
                <span className={`relative z-10 w-full whitespace-nowrap px-1.5 text-xs font-bold ${
                    checked ? "translate-x-px text-left" : "-translate-x-0.5 text-right"
                }`}>
                    {label}
                </span>
            )}
        </button>
    );
}
