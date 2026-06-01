# DoubleCode Feedback Backend

TypeScript Node.js backend for the footer feedback comments.

## Run

```bash
cd backend
cp .env.example .env
npm run dev
```

Build and run the emitted JavaScript:

```bash
npm run build
npm run start
```

Type-check without emitting files:

```bash
npm run typecheck
```

The server listens on `http://localhost:4000` by default.

The frontend dev server proxies `/api` to this backend through `vite.config.ts`.

`CORS_ORIGIN` accepts one or more comma-separated origins:

```bash
CORS_ORIGIN=https://doublecode.net,https://www.doublecode.net
```

## API

- `GET /api/comments`
- `POST /api/comments`
- `POST /api/comments/:id/verify-password`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`

Public comment creation always stores `author_role = 'user'`. Developer comments should be handled later through a separate authenticated admin path.

## Data

PostgreSQL is configured with `DATABASE_URL`. On Render, create a Postgres database and set the backend service's `DATABASE_URL` environment variable from Render's internal connection string.

The backend stores:

- comment rows in `feedback_comments`
- create/update audit history in `feedback_comment_revisions`
- hashed passwords only
- hashed IP addresses only
