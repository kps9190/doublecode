export type DownloadKind = "barcode" | "qr";
type DownloadOption = string | number | boolean | null | undefined;

interface DownloadNameParts {
    kind: DownloadKind;
    label: string;
    options: DownloadOption[];
    extension?: string;
}

/**
 * 다운로드 파일명 정책을 한곳에 모은 작은 값 객체.
 * UI 컴포넌트는 어떤 옵션이 파일을 구분하는지만 넘기고, 포맷은 이 객체가 책임진다.
 */
export class DownloadNameBuilder {
    private readonly options: DownloadOption[] = [];
    private extension = "";

    constructor(
        private readonly kind: DownloadKind,
        private readonly label: string
    ) {}

    withOptions(options: DownloadOption[]): this {
        this.options.push(...options);
        return this;
    }

    withExtension(extension: string): this {
        this.extension = extension;
        return this;
    }

    build(): string {
        const safeLabel = makeSafeName(this.label, 40) || "code";
        const signature = this.makeShortSignature();
        const stamp = DownloadNameBuilder.makeTimestampToken();
        const basename = `${this.kind}_${safeLabel}_${signature}_${stamp}`;

        return this.extension ? `${basename}.${this.extension}` : basename;
    }

    private makeShortSignature(): string {
        const source = this.options.map((part) => String(part ?? "")).join("|");
        let hash = 0x811c9dc5;

        for (let i = 0; i < source.length; i += 1) {
            hash ^= source.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193);
        }

        return (hash >>> 0).toString(36).padStart(6, "0").slice(0, 6);
    }

    private static makeTimestampToken(): string {
        const now = new Date();
        const pad = (value: number, size = 2) => String(value).padStart(size, "0");

        return [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
            "-",
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
            "-",
            pad(now.getMilliseconds(), 3),
        ].join("");
    }
}

export function makeDownloadFilename({ kind, label, options, extension }: DownloadNameParts): string {
    const builder = new DownloadNameBuilder(kind, label).withOptions(options);
    return extension ? builder.withExtension(extension).build() : builder.build();
}

/**
 * 파일 다운로드에 안전한 파일명 조각 생성.
 * 공백은 언더스코어로 바꾸고, OS별로 문제가 될 수 있는 문자는 제거한다.
 */
export function makeSafeName(s: string, maxLen = 64): string {
    return (s || "")
        .replace(/\s+/g, "_")
        .replace(/[^\w-]+/g, "_")
        .replace(/_+/g, "_")
        .slice(0, maxLen)
        .replace(/^_+|_+$/g, "");
}
