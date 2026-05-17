/**
 * 브라우저 다운로드를 트리거하는 공통 유틸리티.
 * Blob URL 을 생성하고, 링크 클릭 후 메모리를 해제한다.
 * iOS Safari 는 즉시 revokeObjectURL 하면 다운로드가 실패하므로 5초 딜레이를 둔다.
 */
export function triggerDownload(filename: string, url: string): void {
    const a = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

export function blobToDownload(filename: string, blob: Blob): void {
    triggerDownload(filename, URL.createObjectURL(blob));
}
