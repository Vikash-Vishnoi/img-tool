# ImgTools

Repo layout:

- `frontend/` — Next.js (App Router) image tools website
- `backend/` — reserved for future APIs/workers (currently empty)
- `deploy/` — Nginx + PM2 deployment configs for Ubuntu VM

## Local development

```bash
cd frontend
npm install
npm run dev
```

## Production build

```bash
cd frontend
npm run build
npm start
```

## Deploy on Render (production)

This repo includes a Render Blueprint config at `render.yaml`.

Important:
- Use production start (`npm run start`), not `npm run dev`.
- Running dev mode behind strict CSP can show React eval warnings by design.

Recommended setup:
1) Create a new Web Service from the repo (or Blueprint) in Render.
2) Ensure service uses `frontend/` as root directory.
3) Build command: `npm ci && npm run build`.
4) Start command: `npm run start`.
5) Set env vars in Render:
	- `NEXT_PUBLIC_SITE_URL=https://<your-render-domain-or-custom-domain>`
	- `NEXT_PUBLIC_GA_ID` (optional)
	- `NEXT_PUBLIC_GOOGLE_VERIFICATION` (optional)
	- `NEXT_PUBLIC_TWITTER_CREATOR` (optional)
