import type { DecorationSide } from "../../../types";
import { FieldRow, RangeField, Toggle, ColorField } from "../../ui";

interface Props {
    /** 방향 레이블 (상단 / 하단 / 좌측 / 우측) */
    label:    string;
    side:     DecorationSide;
    onChange: (patch: Partial<DecorationSide>) => void;
}

/**
 * 테두리 장식 텍스트 — 한 방향(상/하/좌/우)의 설정 블록.
 * QRBorderSection 에서 4번 사용한다.
 */
export default function DecorationSideBlock({ label, side, onChange }: Props) {
    return (
        <>
            <Toggle
                label={`${label} 텍스트`}
                checked={side.enabled}
                onChange={(v) => onChange({ enabled: v })}
            />
            {side.enabled && (
                <>
                    <FieldRow label={`${label} 내용`}>
                        <input
                            type="text"
                            value={side.text}
                            onChange={(e) => onChange({ text: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-2 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </FieldRow>
                    <RangeField
                        id={`deco-${label}-fs`}
                        label={`${label} 크기`}
                        min={8} max={60}
                        value={side.fontSize}
                        onChange={(v) => onChange({ fontSize: v })}
                    />
                    <ColorField
                        label={`${label} 색`}
                        value={side.color}
                        onChange={(v) => onChange({ color: v })}
                    />
                    <Toggle
                        label={`${label} 굵게`}
                        checked={side.bold}
                        onChange={(v) => onChange({ bold: v })}
                    />
                </>
            )}
        </>
    );
}
