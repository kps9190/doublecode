import { useEffect, useState } from "react";

interface UseRangeNumberInputArgs {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function isIncompleteNumber(value: string) {
    return value === "" || value === "-" || value === ".";
}

/**
 * Keeps the number box editable without forcing every intermediate keystroke
 * into the slider range. This lets users type values like "300" naturally.
 */
export function useRangeNumberInput({ min, max, value, onChange }: UseRangeNumberInputArgs) {
    const [draftValue, setDraftValue] = useState(String(value));

    useEffect(() => {
        setDraftValue(String(value));
    }, [value]);

    const changeDraftValue = (nextValue: string) => {
        setDraftValue(nextValue);

        if (isIncompleteNumber(nextValue)) return;

        const parsed = Number(nextValue);
        if (Number.isNaN(parsed) || parsed < min || parsed > max) return;

        onChange(parsed);
    };

    const commitDraftValue = () => {
        const parsed = Number(draftValue);
        const nextValue = Number.isNaN(parsed) ? value : clamp(parsed, min, max);

        setDraftValue(String(nextValue));
        onChange(nextValue);
    };

    return {
        draftValue,
        changeDraftValue,
        commitDraftValue,
    };
}
