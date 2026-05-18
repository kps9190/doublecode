import { useI18n } from "../../i18n";

export default function Footer() {
    const { t } = useI18n();

    return (
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-slate-500 dark:text-slate-700">
            {t("app.footer")}
        </p>
    );
}
