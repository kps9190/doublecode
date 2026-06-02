import ColorSwatchInput from "./ColorSwatchInput";
import LabeledSwitch from "./LabeledSwitch";

interface Props {
    label: string;
    color: string;
    transparent: boolean;
    transparentLabel: string;
    onColorChange: (color: string) => void;
    onTransparentChange: (transparent: boolean) => void;
}

export default function BackgroundField({
    label,
    color,
    transparent,
    transparentLabel,
    onColorChange,
    onTransparentChange,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 py-2.5 last:border-b-0 dark:border-slate-700">
            <div className="grow-0 shrink-0 basis-36 text-sm font-medium text-slate-700 dark:text-slate-300 md:basis-2/5">
                {label}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {!transparent && (
                    <>
                        <ColorSwatchInput value={color} ariaLabel={label} onChange={onColorChange} className="h-8 w-12" />
                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
                    </>
                )}
                <LabeledSwitch
                    checked={transparent}
                    label={transparentLabel}
                    onChange={onTransparentChange}
                />
            </div>
        </div>
    );
}
