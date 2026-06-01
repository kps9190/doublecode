import { useI18n } from "../../i18n";
// import { FeedbackComments } from "../comments";

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
            {/* <FeedbackComments /> */}
            <p className="text-center text-xs uppercase tracking-widest text-slate-500 dark:text-slate-700">
                {t("app.footer")}
            </p>
        </footer>
    );
}
