# DoubleCode

One input, two outputs: generate a barcode and a QR code at the same time.

[한국어](#한국어) | [English](#english)

---

## 한국어

DoubleCode는 한 번 입력한 내용을 바코드와 QR코드로 동시에 만들어 주는 React/Vite 기반 웹 앱입니다. 데스크톱에서는 두 코드를 함께 비교하며 편집할 수 있고, 모바일에서는 QR코드를 먼저 보여준 뒤 스와이프로 바코드 화면으로 전환할 수 있습니다.

### 주요 기능

- 바코드와 QR코드 동시 생성
- CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar 등 다양한 바코드 형식 지원
- QR 크기, 여백, 오류정정 수준, 모드, 색상, 이미지, 텍스트 덮어쓰기 설정
- 바코드 색상, 여백, 높이, 선 간격, 텍스트 표시 설정
- PNG/SVG 다운로드
- 라이트 모드와 다크 모드
- 한국어/영어 UI 지원 및 브라우저 언어 자동 감지
- 모바일 캐러셀 화면
- `doublecode.net` 모바일 접속 시 `m.doublecode.net` 자동 이동
- 공식 `qr-border-plugin` 연동 준비, 기본 비활성화

### 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS
- JsBarcode
- qr-code-styling
- qr-border-plugin

### 시작하기

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://localhost:5173`입니다.

### 스크립트

```bash
npm run dev       # 개발 서버 실행
npm run lint      # ESLint 검사
npx tsc -b        # TypeScript 타입 검사
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

### 환경 변수

`.env.example`을 복사해 `.env`를 만들고 필요한 값만 설정합니다.

```bash
VITE_ENABLE_QR_BORDER_PLUGIN=false
VITE_QR_BORDER_PLUGIN_KEY=
```

`qr-border-plugin`은 공식 플러그인으로 연결만 준비되어 있습니다. 라이선스 키 구입이 어려운 상태를 고려해 기본값은 꺼져 있으며, `VITE_ENABLE_QR_BORDER_PLUGIN=true`일 때만 플러그인 적용을 시도합니다. 키가 없을 때는 플러그인 정책에 따라 워터마크나 제한이 생길 수 있습니다.

### 배포

이 앱은 백엔드가 없는 정적 SPA입니다.

```bash
npm run build
```

빌드 결과는 `dist/`에 생성됩니다. GitHub Pages, Vercel, Netlify, Cloudflare Pages 같은 정적 호스팅에 올릴 수 있습니다.

모바일 리다이렉트는 실제 호스트가 `doublecode.net` 또는 `www.doublecode.net`일 때만 동작합니다. `m.doublecode.net`도 같은 빌드 결과를 서빙하거나 별도 모바일 배포 대상으로 연결해 주세요. 로컬 개발 주소에서는 리다이렉트하지 않습니다.

### 프로젝트 구조

```text
src/
  components/
    barcode/      바코드 미리보기와 설정 UI
    qrcode/       QR 미리보기와 설정 UI
    layout/       데스크톱/모바일 레이아웃, 다운로드 버튼
    ui/           공통 입력, 버튼, 카드 컴포넌트
  constants/      기본값, 선택 옵션, 메시지
  hooks/          바코드, QR, 입력 상태 관리
  types/          상태와 공개 API 타입
  utils/          검증, 다운로드, QR 플러그인, 텍스트 헬퍼
```

### 유지보수 메모

- 바코드 옵션 조립은 `src/components/barcode/barcodePreviewConfig.ts`에 모여 있습니다.
- QR 옵션 조립은 `src/components/qrcode/qrPreviewConfig.ts`에 모여 있습니다.
- QR 미리보기는 Safari 초기 렌더 안정성을 위해 SVG 타입으로 렌더링합니다.
- 다운로드 로직은 `src/utils/download/` 아래에 분리되어 있습니다.
- 다국어 문구는 `src/i18n.tsx`에서 관리합니다.
- QR 표시 텍스트 정리는 `src/utils/qrText.ts`에서 관리합니다.
- QR 테두리 플러그인 연결은 `src/utils/qrBorderPlugin.ts`에서 관리합니다.

---

## English

DoubleCode is a React/Vite web app that turns one input into both a barcode and a QR code. Desktop users can edit both previews side by side, while mobile users see the QR code first and can swipe to the barcode view.

### Features

- Generate a barcode and a QR code from one input
- Supports CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar, and more
- QR size, margin, error correction level, mode, color, image, and text overlay options
- Barcode color, margin, height, line spacing, and text display options
- PNG/SVG downloads
- Light and dark themes
- Korean/English UI with browser-language detection
- Mobile carousel layout
- Redirects mobile visitors from `doublecode.net` to `m.doublecode.net`
- Official `qr-border-plugin` integration is prepared but disabled by default

### Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- JsBarcode
- qr-code-styling
- qr-border-plugin

### Getting Started

```bash
npm install
npm run dev
```

The default development URL is `http://localhost:5173`.

### Scripts

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npx tsc -b        # Run TypeScript type checking
npm run build     # Build for production
npm run preview   # Preview the production build locally
```

### Environment Variables

Copy `.env.example` to `.env` and configure only the values you need.

```bash
VITE_ENABLE_QR_BORDER_PLUGIN=false
VITE_QR_BORDER_PLUGIN_KEY=
```

The official `qr-border-plugin` integration is wired in, but it is disabled by default because the license key may not be available. Set `VITE_ENABLE_QR_BORDER_PLUGIN=true` only when you want to try the plugin. Without a valid key, the plugin may show a watermark or apply its own restrictions.

### Deployment

This is a static SPA with no backend requirement.

```bash
npm run build
```

The production output is generated in `dist/`. You can deploy it to static hosts such as GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

The mobile redirect only runs when the host is `doublecode.net` or `www.doublecode.net`. Make sure `m.doublecode.net` serves the same build or points to the intended mobile deployment. Local development URLs are not redirected.

### Project Structure

```text
src/
  components/
    barcode/      Barcode preview and option UI
    qrcode/       QR preview and option UI
    layout/       Desktop/mobile layouts and download controls
    ui/           Shared inputs, buttons, and cards
  constants/      Defaults, selectable options, and messages
  hooks/          Barcode, QR, and input state
  types/          State and public API types
  utils/          Validation, downloads, QR plugin, and text helpers
```

### Maintenance Notes

- Barcode option composition lives in `src/components/barcode/barcodePreviewConfig.ts`.
- QR option composition lives in `src/components/qrcode/qrPreviewConfig.ts`.
- QR previews render as SVG for better initial rendering stability in Safari.
- Download behavior is separated under `src/utils/download/`.
- UI translations are managed in `src/i18n.tsx`.
- QR display text helpers live in `src/utils/qrText.ts`.
- QR border plugin wiring lives in `src/utils/qrBorderPlugin.ts`.
