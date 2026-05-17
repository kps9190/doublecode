import { useI18n } from "../../i18n";

interface Props { canDownload: boolean; onPng: () => void; onSvg: () => void }
export default function DownloadButtons({ canDownload, onPng, onSvg }: Props) {
    const { t } = useI18n();

    return (
        <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3">
            <button type="button" onClick={onPng} disabled={!canDownload}
                className="w-full px-3 h-10 text-sm rounded-lg border border-slate-300 bg-slate-950 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity font-medium dark:border-slate-600 dark:bg-white dark:text-gray-900">
                {t("common.png")}
            </button>
            <button type="button" onClick={onSvg} disabled={!canDownload}
                className="w-full px-3 h-10 text-sm rounded-lg border border-slate-300 bg-transparent text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                {t("common.svg")}
            </button>
        </div>
    );
}
