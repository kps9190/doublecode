import { useEffect } from "react";

const MOBILE_HOST = "m.doublecode.net";
const DESKTOP_HOSTS = new Set(["doublecode.net", "www.doublecode.net"]);
const MOBILE_VIEWPORT_QUERY = "(max-width: 767px)";
const MOBILE_AGENT_RE = /Android|iPhone|iPad|iPod|Mobile/i;

export function useMobileHostRedirect() {
    useEffect(() => {
        // 메인 도메인으로 모바일 접속 시 모바일 전용 호스트로 보낸다.
        const isMobileViewport = window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
        const isMobileAgent = MOBILE_AGENT_RE.test(navigator.userAgent);

        if (!DESKTOP_HOSTS.has(window.location.hostname)) return;
        if (!isMobileViewport && !isMobileAgent) return;

        window.location.replace(
            `https://${MOBILE_HOST}${window.location.pathname}${window.location.search}${window.location.hash}`
        );
    }, []);
}
