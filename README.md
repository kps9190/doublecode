# DoubleCode

One input flow, two outputs: generate a barcode and a QR code from the same content.

[한국어](#한국어) | [English](#english)

---

## 한국어

DoubleCode는 입력한 내용을 바코드와 QR코드로 동시에 만들어 주는 웹 앱입니다.  
가장 큰 특징은 입력창을 **왼쪽 / 중앙 / 오른쪽 최대 3개**까지 나눠서 사용할 수 있다는 점입니다. 세 입력값은 내부적으로 하나의 문자열처럼 이어 붙여지기 때문에, 고정된 앞부분이나 뒷부분은 그대로 두고 가운데 값만 바꾸는 식으로 반복 작업을 할 수 있습니다.

예를 들어 `ABC-`, `123456`, `-KR`처럼 나눠두면 최종 인코딩 값은 `ABC-123456-KR`이 됩니다. 일부 내용만 수정할 때 매번 긴 문자열을 드래그하거나 다시 입력할 필요가 없습니다.

### 주요 기능

- 바코드와 QR코드 동시 생성
- 왼쪽 / 중앙 / 오른쪽 최대 3개 입력창을 하나의 값처럼 결합
- CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar 등 다양한 바코드 형식 지원
- 바코드 선 색상, 글자 색상, 배경색, 투명 배경, 높이, 선 간격, 여백, 텍스트 표시 설정
- QR 크기, 여백, 오류정정 수준, 모드, 색상, 배경색, 투명 배경, 중앙 이미지, 표시 텍스트 설정
- PNG/SVG 다운로드
- 댓글 기반 피드백 섹션
- 한국어/영어 UI
- 시스템 설정과 동기화되는 라이트/다크 모드

### 기술 스택

프론트엔드:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- JsBarcode
- qr-code-styling

백엔드:

- Node.js
- TypeScript
- PostgreSQL
- Supabase PostgreSQL
- Render 배포

### 시작하기

프론트엔드 개발 서버:

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:5173`입니다.

백엔드 개발 서버:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

백엔드는 기본적으로 `http://localhost:4000`에서 실행됩니다. 프론트엔드 개발 서버는 `vite.config.ts`를 통해 `/api` 요청을 로컬 백엔드로 프록시합니다.

### 프론트엔드 환경 변수

`.env.example`을 참고해 필요한 값만 설정합니다.

```bash
VITE_COMMENTS_API_URL=/api/comments
```

배포 환경에서는 Render 백엔드 주소를 사용합니다.

```bash
VITE_COMMENTS_API_URL=https://doublecode.onrender.com/api/comments
```

### 백엔드 환경 변수

`backend/.env.example`을 참고합니다.

```bash
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/doublecode
PASSWORD_PEPPER=change-this-before-deploy
IP_HASH_SECRET=change-this-before-deploy
CORS_ORIGIN=http://localhost:5173,https://doublecode.net,https://www.doublecode.net
```

`PASSWORD_PEPPER`와 `IP_HASH_SECRET`은 배포 전에 긴 랜덤 문자열로 설정합니다.

### 배포

프론트엔드는 Vercel에 배포합니다.

```bash
npm run build
```

백엔드는 Render에 배포합니다.

Render 설정 예시:

- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment: `DATABASE_URL`, `PASSWORD_PEPPER`, `IP_HASH_SECRET`, `CORS_ORIGIN`

데이터베이스는 Supabase PostgreSQL을 사용합니다. Supabase의 connection string을 Render 백엔드 서비스의 `DATABASE_URL`에 설정합니다.

### 프로젝트 구조

```text
src/
  components/
    barcode/      바코드 미리보기와 설정 UI
    qrcode/       QR 미리보기와 설정 UI
    code/         QR/바코드 공통 설정 컴포넌트
    comments/     피드백 댓글 UI
    layout/       데스크톱/모바일 레이아웃, 다운로드 버튼, Footer
    ui/           공통 입력, 버튼, 카드 컴포넌트
  constants/      기본값, 선택 옵션, 메시지
  domain/         도메인 규칙과 상태 유틸
  hooks/          바코드, QR, 입력, 테마 상태 관리
  services/       API 통신
  types/          상태와 공개 API 타입
  utils/          검증, 다운로드, QR 텍스트 헬퍼

backend/
  src/
    comments/     댓글 저장소와 서비스
    domain/       댓글 검증 규칙
    routes/       API 라우팅
```

### 유지보수 메모

- 입력창 결합 로직은 `src/hooks/useCombinedInput.ts`에 있습니다.
- 바코드 옵션 조립은 `src/components/barcode/barcodePreviewConfig.ts`에 있습니다.
- QR 옵션 조립은 `src/components/qrcode/qrPreviewConfig.ts`에 있습니다.
- 다운로드 로직은 `src/utils/download/` 아래에 분리되어 있습니다.
- 댓글 API 통신은 `src/services/comments/FeedbackCommentService.ts`에서 담당합니다.
- 댓글 백엔드는 `backend/src/comments/`와 `backend/src/routes/commentRoutes.ts`를 중심으로 구성되어 있습니다.
- QR/바코드 공통 UI는 `src/components/code/` 아래에 분리되어 있습니다.

---

## English

DoubleCode is a web app that generates both a barcode and a QR code from the same content.

Its main feature is the split input flow: users can expand the input into **left / center / right**, up to three fields. The app joins those fields into one final value internally, so repeated edits are easier. For example, `ABC-`, `123456`, and `-KR` become `ABC-123456-KR`. This is useful when only one part of a long value changes often.

### Features

- Generate a barcode and a QR code from the same content
- Split input into up to three fields and join them as one encoded value
- Supports CODE128, CODE39, EAN, UPC, ITF, MSI, Pharmacode, Codabar, and more
- Barcode line color, text color, background color, transparent background, height, line width, margin, and text display options
- QR size, margin, error correction level, mode, color, background color, transparent background, center image, and display text options
- PNG/SVG downloads
- Footer feedback comments
- Korean/English UI
- Light/dark mode synced with the system setting

### Tech Stack

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- JsBarcode
- qr-code-styling

Backend:

- Node.js
- TypeScript
- PostgreSQL
- Supabase PostgreSQL
- Render

### Getting Started

Frontend:

```bash
npm install
npm run dev
```

The default frontend URL is `http://localhost:5173`.

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs on `http://localhost:4000` by default. During local development, Vite proxies `/api` requests to the backend through `vite.config.ts`.

### Frontend Environment Variables

Use `.env.example` as a reference.

```bash
VITE_COMMENTS_API_URL=/api/comments
```

For production, point it to the Render backend.

```bash
VITE_COMMENTS_API_URL=https://doublecode.onrender.com/api/comments
```

### Backend Environment Variables

Use `backend/.env.example` as a reference.

```bash
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/doublecode
PASSWORD_PEPPER=change-this-before-deploy
IP_HASH_SECRET=change-this-before-deploy
CORS_ORIGIN=http://localhost:5173,https://doublecode.net,https://www.doublecode.net
```

Set `PASSWORD_PEPPER` and `IP_HASH_SECRET` to long random values before deployment.

### Deployment

Deploy the frontend to Vercel.

```bash
npm run build
```

Deploy the backend to Render.

Render settings:

- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment: `DATABASE_URL`, `PASSWORD_PEPPER`, `IP_HASH_SECRET`, `CORS_ORIGIN`

The database is Supabase PostgreSQL. Set the Supabase connection string as the backend service's `DATABASE_URL`.

### Project Structure

```text
src/
  components/
    barcode/      Barcode preview and option UI
    qrcode/       QR preview and option UI
    code/         Shared QR/barcode option components
    comments/     Feedback comment UI
    layout/       Desktop/mobile layouts, download buttons, Footer
    ui/           Shared inputs, buttons, and cards
  constants/      Defaults, selectable options, and messages
  domain/         Domain rules and state utilities
  hooks/          Barcode, QR, input, and theme state
  services/       API clients
  types/          State and public API types
  utils/          Validation, downloads, and QR text helpers

backend/
  src/
    comments/     Comment repository and service
    domain/       Comment validation rules
    routes/       API routing
```

### Maintenance Notes

- Split input composition lives in `src/hooks/useCombinedInput.ts`.
- Barcode option composition lives in `src/components/barcode/barcodePreviewConfig.ts`.
- QR option composition lives in `src/components/qrcode/qrPreviewConfig.ts`.
- Download behavior is separated under `src/utils/download/`.
- Comment API calls are handled by `src/services/comments/FeedbackCommentService.ts`.
- The feedback backend is centered around `backend/src/comments/` and `backend/src/routes/commentRoutes.ts`.
- Shared QR/barcode UI components live under `src/components/code/`.
