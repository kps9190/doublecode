import { useI18n } from "../../i18n";

const koSteps = [
    {
        title: "내용 입력",
        body: "가운데 입력창에 상품번호, URL, 연락처, 안내 문구처럼 코드에 담을 내용을 입력하세요. 왼쪽/오른쪽 입력창을 켜면 앞뒤 문구를 붙인 코드도 만들 수 있습니다.",
    },
    {
        title: "바코드와 QR 확인",
        body: "입력한 내용은 바코드와 QR코드 미리보기에 동시에 반영됩니다. 모바일에서는 상단 아이콘이나 좌우 스와이프로 두 코드를 전환할 수 있습니다.",
    },
    {
        title: "형식과 스타일 조정",
        body: "바코드는 CODE128, EAN, UPC 등 용도에 맞는 형식을 고르고, QR코드는 크기, 여백, 오류정정, 점 모양, 색상, 중앙 이미지를 조정할 수 있습니다.",
    },
    {
        title: "PNG 또는 SVG 저장",
        body: "웹과 문서에는 PNG를, 인쇄물이나 큰 사이즈 편집에는 SVG를 권장합니다. 투명 배경을 켜면 스티커, 라벨, 패키지 디자인에 얹기 쉽습니다.",
    },
];

const enSteps = [
    {
        title: "Enter content",
        body: "Type the product number, URL, contact detail, or message you want to encode. Enable the left or right input to add text before or after the main value.",
    },
    {
        title: "Check both codes",
        body: "Your input updates the barcode and QR preview at the same time. On mobile, switch views with the top icons or by swiping sideways.",
    },
    {
        title: "Adjust format and style",
        body: "Choose a barcode format such as CODE128, EAN, or UPC, then tune QR size, margin, error correction, dot shape, color, and center image.",
    },
    {
        title: "Save PNG or SVG",
        body: "Use PNG for web pages and documents. Use SVG for print, labels, packaging, or layouts that need clean scaling.",
    },
];

const koTips = [
    "EAN과 UPC는 정해진 숫자 자리수와 체크섬을 요구합니다. 오류가 보이면 마지막 숫자나 자리수를 먼저 확인하세요.",
    "QR코드에 로고나 이미지를 넣을 때는 오류정정 수준을 높이면 인식 안정성이 좋아집니다.",
    "인쇄용 코드는 배경과 코드 색상의 대비를 충분히 두고, QR 여백을 너무 줄이지 않는 편이 안전합니다.",
];

const enTips = [
    "EAN and UPC require fixed digit counts and checksums. If validation fails, check the final digit and total length first.",
    "When adding a logo or image to a QR code, use a higher error correction level for better scan reliability.",
    "For print, keep strong contrast between the code and background, and avoid trimming QR margins too tightly.",
];

export default function UsageGuide() {
    const { language } = useI18n();
    const isKo = language === "ko";
    const steps = isKo ? koSteps : enSteps;
    const tips = isKo ? koTips : enTips;

    return (
        <main className="mx-auto mt-2 max-w-5xl pb-4">
            <section className="border-y border-slate-200 py-8 text-left dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">
                    {isKo ? "Usage Guide" : "Usage Guide"}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
                    {isKo ? "DoubleCode를 처음 쓰는 사람을 위한 빠른 안내" : "A quick guide for first-time DoubleCode users"}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                    {isKo
                        ? "바코드와 QR코드를 따로 만들 필요 없이 한 화면에서 입력, 미리보기, 스타일 조정, 저장까지 이어갈 수 있습니다."
                        : "Create, preview, style, and export barcodes and QR codes from one focused workspace."}
                </p>
            </section>

            <section className="mt-8 grid gap-3 sm:grid-cols-2">
                {steps.map((step, index) => (
                    <article
                        key={step.title}
                        className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-800 dark:bg-slate-800"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                                {index + 1}
                            </span>
                            <h3 className="text-base font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p>
                    </article>
                ))}
            </section>

            <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 text-left dark:border-slate-800 dark:bg-slate-800">
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                    {isKo ? "잘 스캔되는 코드를 위한 체크포인트" : "Checks for reliable scanning"}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {tips.map((tip) => (
                        <li key={tip} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
