import { useMemo, useState } from "react";

export interface CombinedInputState {
    leftEnabled:  boolean;
    rightEnabled: boolean;
    leftText:   string;
    centerText: string;
    rightText:  string;
    /** 세 입력창을 하나로 합친 최종 문자열 */
    codeData: string;
    toggleLeft:  () => void;
    toggleRight: () => void;
    setLeftText:   (v: string) => void;
    setCenterText: (v: string) => void;
    setRightText:  (v: string) => void;
}

/**
 * 왼쪽/중앙/오른쪽 입력창 상태를 관리한다.
 * 비활성화된 창의 텍스트는 codeData 조합에서 제외된다.
 */
export function useCombinedInput(initialCenter = ""): CombinedInputState {
    const [leftEnabled,  setLeftEnabled]  = useState(false);
    const [rightEnabled, setRightEnabled] = useState(false);
    const [leftText,   setLeftText]   = useState("");
    const [centerText, setCenterText] = useState(initialCenter);
    const [rightText,  setRightText]  = useState("");

    const codeData = useMemo(
        () => (leftEnabled ? leftText : "") + centerText + (rightEnabled ? rightText : ""),
        [leftEnabled, rightEnabled, leftText, centerText, rightText]
    );

    const toggleLeft = () => {
        setLeftEnabled((v) => {
            if (v) setLeftText(""); // 비활성화 시 초기화
            return !v;
        });
    };

    const toggleRight = () => {
        setRightEnabled((v) => {
            if (v) setRightText("");
            return !v;
        });
    };

    return {
        leftEnabled, rightEnabled,
        leftText, centerText, rightText, codeData,
        toggleLeft, toggleRight,
        setLeftText, setCenterText, setRightText,
    };
}
