import type { GradientConfig } from "../../types";
import RangeField from "../ui/RangeField";
import SmallColorInput from "./SmallColorInput";

interface Props {
    id: string;
    value: GradientConfig;
    onChange: (patch: Partial<GradientConfig>) => void;
    t: (key: string) => string;
}

export default function GradientControls({ id, value, onChange, t }: Props) {
    return (
        <>
            <select
                value={value.type}
                onChange={(event) => onChange({ type: event.target.value as GradientConfig["type"] })}
                className="h-7 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            >
                <option value="linear">{t("color.linear")}</option>
                <option value="radial">{t("color.radial")}</option>
            </select>
            <div className="inline-flex shrink-0 items-center gap-2">
                <SmallColorInput value={value.color1} onChange={(color1) => onChange({ color1 })} />
                <SmallColorInput value={value.color2} onChange={(color2) => onChange({ color2 })} />
            </div>
            <div className="min-w-28 flex-1 sm:min-w-36">
                <RangeField
                    id={id}
                    min={0}
                    max={360}
                    value={value.rotation}
                    onChange={(rotation) => onChange({ rotation })}
                />
            </div>
        </>
    );
}
