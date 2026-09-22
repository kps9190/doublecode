import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../i18n";

type Target = "input" | "preview" | "settings" | "download";
type Highlight = { x: number; y: number; width: number; height: number };

const steps: { target: Target; ko: [string, string]; en: [string, string] }[] = [
    {
        target: "input",
        ko: ["내용 입력", "생성할 값을 입력하세요. 왼쪽과 오른쪽 버튼을 눌러 각각의 위치에 입력창을 추가하거나 제거할 수 있습니다."],
        en: ["Enter content", "Enter the value you want to turn into a code. Use the Left and Right buttons to add or remove an input field on either side."],
    },
    {
        target: "preview",
        ko: ["바로 확인", "입력 내용을 바꾸면 바코드와 QR코드 미리보기가 동시에 갱신됩니다. 모바일에서는 위쪽 아이콘을 눌러 두 미리보기를 전환할 수 있습니다."],
        en: ["Check the preview", "Changes to the input update both previews at once. On mobile, tap the icons above to switch between the barcode and QR code."],
    },
    {
        target: "settings",
        ko: ["모양 꾸미기", "이 설정값을 조정해 코드의 모양이나 크기를 바꿀 수 있습니다."],
        en: ["Customize the look", "Adjust these settings to change the code's shape or size."],
    },
    {
        target: "download",
        ko: ["파일로 저장", "미리보기가 마음에 들면 PNG 또는 SVG를 눌러 저장하세요. PNG는 문서와 웹에, SVG는 인쇄나 크기 변경이 필요한 작업에 적합합니다."],
        en: ["Save your code", "When the preview looks right, choose PNG or SVG to download it. PNG suits documents and web pages; SVG suits print and layouts that need resizing."],
    },
];

function findVisibleTarget(target: Target): HTMLElement | undefined {
    return Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`))
        .find((element) => element.getClientRects().length > 0);
}

export default function UsageTour({ onClose }: { onClose: () => void }) {
    const { language } = useI18n();
    const [stepIndex, setStepIndex] = useState(0);
    const [highlight, setHighlight] = useState<Highlight | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const step = steps[stepIndex];
    const [title, body] = language === "ko" ? step.ko : step.en;

    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        return () => previousFocus?.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowRight") setStepIndex((current) => Math.min(current + 1, steps.length - 1));
            if (event.key === "ArrowLeft") setStepIndex((current) => Math.max(current - 1, 0));
            if (event.key !== "Tab") return;

            const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useLayoutEffect(() => {
        const target = findVisibleTarget(step.target);
        if (!target) return;

        const measure = () => {
            const rect = target.getBoundingClientRect();
            const x = Math.max(8, rect.left - 8);
            const y = Math.max(8, rect.top - 8);
            setHighlight({
                x,
                y,
                width: Math.max(0, Math.min(window.innerWidth - 8, rect.right + 8) - x),
                height: Math.max(0, Math.min(window.innerHeight - 8, rect.bottom + 8) - y),
            });
        };

        if (step.target === "settings") {
            const desiredTop = Math.min(window.innerHeight * 0.42, 290);
            window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - desiredTop), behavior: "smooth" });
        } else {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        measure();
        window.addEventListener("scroll", measure, true);
        window.addEventListener("resize", measure);
        const observer = new ResizeObserver(measure);
        observer.observe(target);

        return () => {
            window.removeEventListener("scroll", measure, true);
            window.removeEventListener("resize", measure);
            observer.disconnect();
        };
    }, [step.target]);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = Math.min(360, viewportWidth - 32);
    const cardHeight = dialogRef.current?.offsetHeight || 218;
    const cardLeft = highlight
        ? Math.max(16, Math.min(viewportWidth - cardWidth - 16, highlight.x + highlight.width / 2 - cardWidth / 2))
        : (viewportWidth - cardWidth) / 2;
    const cardTop = highlight
        ? viewportHeight - (highlight.y + highlight.height) >= cardHeight + 24
            ? highlight.y + highlight.height + 12
            : highlight.y >= cardHeight + 24
                ? highlight.y - cardHeight - 12
                : Math.max(16, viewportHeight - cardHeight - 16)
        : (viewportHeight - cardHeight) / 2;

    return createPortal(
        <div className="fixed inset-0 z-50" aria-label={language === "ko" ? "사용법 안내" : "Usage guide"}>
            {highlight ? (
                <>
                    <div className="tour-shade" style={{ top: 0, left: 0, width: "100%", height: highlight.y }} onClick={onClose} />
                    <div className="tour-shade" style={{ top: highlight.y, left: 0, width: highlight.x, height: highlight.height }} onClick={onClose} />
                    <div className="tour-shade" style={{ top: highlight.y, left: highlight.x + highlight.width, right: 0, height: highlight.height }} onClick={onClose} />
                    <div className="tour-shade" style={{ top: highlight.y + highlight.height, left: 0, width: "100%", bottom: 0 }} onClick={onClose} />
                    <div
                        className="fixed z-50 rounded-md border-2 border-blue-400 shadow-[0_0_0_1px_rgba(255,255,255,0.45)] dark:border-blue-400"
                        style={{ left: highlight.x, top: highlight.y, width: highlight.width, height: highlight.height }}
                        aria-hidden="true"
                    />
                </>
            ) : (
                <div className="tour-shade inset-0" onClick={onClose} />
            )}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tour-title"
                aria-describedby="tour-body"
                className="fixed z-[51] max-h-[calc(100vh-32px)] overflow-auto rounded-lg border border-slate-200 bg-white p-5 text-left text-slate-950 shadow-xl dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                style={{ left: cardLeft, top: cardTop, width: cardWidth }}
            >
                <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400" aria-live="polite">
                        {stepIndex + 1} / {steps.length}
                    </span>
                    <button ref={closeRef} type="button" onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
                        {language === "ko" ? "닫기" : "Close"}
                    </button>
                </div>
                <h2 id="tour-title" className="mt-3 text-lg font-semibold">{title}</h2>
                <p id="tour-body" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                <div className="mt-5 flex justify-end gap-2">
                    {stepIndex > 0 && (
                        <button type="button" onClick={() => setStepIndex(stepIndex - 1)} className="h-9 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                            {language === "ko" ? "이전" : "Back"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={stepIndex === steps.length - 1 ? onClose : () => setStepIndex(stepIndex + 1)}
                        className="h-9 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-slate-950"
                    >
                        {stepIndex === steps.length - 1 ? (language === "ko" ? "완료" : "Done") : (language === "ko" ? "다음" : "Next")}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
