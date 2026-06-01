import type { QRState } from "../../../types";
import { QR_FONT_FAMILIES } from "../../../constants";
import { CodeTextSection, type CodeTextSettings } from "../../code";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

/** QR 글자 표시·위치·폰트·색상 설정 섹션 */
export default function QRTextSection({ opts, onChange }: Props) {
    if (!opts.showText) return null;

    const updateTextSettings = (patch: Partial<CodeTextSettings>) => {
        const nextPatch: Partial<QRState> = { ...patch };

        if (patch.textAlign !== undefined) {
            nextPatch.textAlign = patch.textAlign as QRState["textAlign"];
        }
        if (patch.textPosition !== undefined) {
            nextPatch.textPosition = patch.textPosition as QRState["textPosition"];
        }

        onChange(nextPatch);
    };

    return (
        <CodeTextSection
            idPrefix="qr"
            value={opts}
            fontOptions={QR_FONT_FAMILIES.map((font) => ({ value: font, label: font }))}
            textMarginMin={0}
            onChange={updateTextSettings}
        />
    );
}
