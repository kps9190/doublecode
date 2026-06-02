import { useRef, type ChangeEvent } from "react";
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => onChange({ image: ev.target?.result as string, imageName: file.name });
        reader.readAsDataURL(file);
    };

    return (
        <>
            <SectionTitle>{t("qr.imageSection")}</SectionTitle>
            <FieldRow label={t("qr.centerImage")}>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                    >
                        {t("qr.chooseImage")}
                    </button>
                    {opts.image && (
                        <span className="min-w-0 truncate text-xs text-slate-500 dark:text-slate-400" title={opts.imageName}>
                            {opts.imageName || t("qr.imageSelected")}
                        </span>
                    )}
                    {opts.image && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange({ image: null, imageName: "" });
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-sm text-red-500 transition-colors hover:text-red-600"
                        >
                            ✕ {t("qr.removeImage")}
                        </button>
                    )}
                </div>
            </FieldRow>
            {opts.image && (
                <>
                    <RangeField id="qr-is" label={t("qr.imageSize")} min={0.1} max={2} step={0.01} value={opts.imageSize} onChange={(v) => onChange({ imageSize: v })} />
                    <RangeField id="qr-im" label={t("qr.imageMargin")} min={0} max={30} value={opts.imageMargin} onChange={(v) => onChange({ imageMargin: v })} />
                </>
            )}
        </>
    );
}
