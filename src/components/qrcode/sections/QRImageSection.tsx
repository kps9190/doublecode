import type { QRState } from "../../../types";
import { FieldRow, RangeField, SectionTitle } from "../../ui";
import { useI18n } from "../../../i18n";

interface Props {
    opts:     QRState;
    onChange: (patch: Partial<QRState>) => void;
}

/** QR 중앙 이미지 삽입 설정 섹션 */
export default function QRImageSection({ opts, onChange }: Props) {
    const { t } = useI18n();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => onChange({ image: ev.target?.result as string });
        reader.readAsDataURL(file);
    };

    return (
        <>
            <SectionTitle>{t("qr.imageSection")}</SectionTitle>
            <FieldRow label={t("qr.centerImage")}>
                <div className="space-y-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block text-sm text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-gray-900 file:text-white dark:file:bg-white dark:file:text-gray-900 cursor-pointer"
                    />
                    {opts.image && (
                        <button
                            type="button"
                            onClick={() => onChange({ image: null })}
                            className="text-sm text-red-500 hover:text-red-600 transition-colors"
                        >
                            ✕ {t("qr.removeImage")}
                        </button>
                    )}
                </div>
            </FieldRow>
            {opts.image && (
                <RangeField id="qr-im" label={t("qr.imageMargin")} min={0} max={30} value={opts.imageMargin} onChange={(v) => onChange({ imageMargin: v })} />
            )}
        </>
    );
}
