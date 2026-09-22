# Development Notes

This document collects the technical setup notes for DoubleCode.

## Run Locally

Frontend:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs at `http://localhost:4000`.

During local development, Vite proxies `/api` requests to the backend through `vite.config.ts`.

## Environment Variables

Frontend:

```bash
VITE_COMMENTS_API_URL=/api/comments
```

Production example:

```bash
VITE_COMMENTS_API_URL=https://doublecode.onrender.com/api/comments
```

Backend:

```bash
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/doublecode
PASSWORD_PEPPER=change-this-before-deploy
IP_HASH_SECRET=change-this-before-deploy
CORS_ORIGIN=http://localhost:5173,https://doublecode.net,https://www.doublecode.net
```

Set `PASSWORD_PEPPER` and `IP_HASH_SECRET` to long random values before deployment.

## Stack

Frontend:

- React
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

## Project Structure

```text
src/
  components/
    barcode/      Barcode preview and options
    qrcode/       QR preview and options
    code/         Shared QR/barcode controls
    comments/     Feedback comments
    guide/        Usage guide
    layout/       Screen layout
    ui/           Shared UI
  hooks/          Barcode, QR, input, and theme state
  services/       API clients
  utils/          Validation and downloads

backend/
  src/
    comments/     Comment repository and service
    routes/       API routing
```

## Maintenance Pointers

- Split input composition lives in `src/hooks/useCombinedInput.ts`.
- Barcode option composition lives in `src/components/barcode/barcodePreviewConfig.ts`.
- QR option composition lives in `src/components/qrcode/qrPreviewConfig.ts`.
- Download behavior is separated under `src/utils/download/`.
- Comment API calls are handled by `src/services/comments/FeedbackCommentService.ts`.
- The feedback backend is centered around `backend/src/comments/` and `backend/src/routes/commentRoutes.ts`.
