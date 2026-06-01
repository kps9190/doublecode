import { useEffect, useRef } from "react";

export function useRestorableBackgroundColor(color: string, transparent: boolean) {
    const lastColorRef = useRef(color);

    useEffect(() => {
        if (!transparent) lastColorRef.current = color;
    }, [color, transparent]);

    return {
        lastColor: lastColorRef.current,
    };
}
