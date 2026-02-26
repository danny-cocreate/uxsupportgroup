# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **UX Support Group community website** — a React SPA (Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui) that connects to a remote cloud Supabase backend. There is no local backend to run; all database, auth, and edge functions are hosted on Supabase cloud.

### Running the app

- `npm run dev` — starts the Vite dev server on `localhost:8080`
- `npm run build` — production build to `dist/`
- `npm run lint` — runs ESLint (pre-existing lint errors exist in the codebase; these are not blocking)
- `npm run preview` — preview the production build

### Key notes

- The `.env` file is committed to the repo with Supabase credentials already configured. No additional environment setup is needed to run the frontend.
- The backend is a remote Supabase instance (`fhfqfxzwfxquertemdnc.supabase.co`). Supabase Edge Functions (13 total) are deployed to the cloud — they are not run locally.
- The `vite.config.ts` binds to `localhost:8080` (not the default 5173).
- The `server.host` is set to `"localhost"` — if you need to access the dev server from outside the container, this may need to be changed to `"0.0.0.0"`.
- ESLint config uses the flat config format (`eslint.config.js`), not the legacy `.eslintrc` format.
