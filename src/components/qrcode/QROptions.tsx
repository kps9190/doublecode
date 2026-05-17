import type { QRState, QRBorderState } from "../../types";
import { Card } from "../ui";
import { useI18n } from "../../i18n";
import QRBasicSection   from "./sections/QRBasicSection";
import QRShapeSection   from "./sections/QRShapeSection";
import QRColorGroup     from "./sections/QRColorGroup";
import QRImageSection   from "./sections/QRImageSection";
import QRTextSection    from "./sections/QRTextSection";
import QRBorderSection  from "./sections/QRBorderSection";

interface Props {
    opts:            QRState;
    onChange:        (patch: Partial<QRState>) => void;
    onForceRecreate: () => void;
}

export default function QROptions({ opts, onChange, onForceRecreate }: Props) {
    const { t } = useI18n();
    // border 패치를 QRState 형태로 래핑
    const patchBorder = (patch: Partial<QRBorderState>) =>
        onChange({ border: { ...opts.border, ...patch } });

    return (
        <Card title={t("qr.options")}>
            <QRBasicSection  opts={opts} onChange={onChange} onForceRecreate={onForceRecreate} />
            <QRShapeSection  opts={opts} onChange={onChange} />
            <QRColorGroup    opts={opts} onChange={onChange} />
            <QRImageSection  opts={opts} onChange={onChange} />
            <QRTextSection   opts={opts} onChange={onChange} />
            {/* 테두리 — 글자 설정처럼 섹션 아래에 통합 */}
            <QRBorderSection border={opts.border} onChange={patchBorder} />
        </Card>
    );
}
