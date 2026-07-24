# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Magies Hub — a unified product portal (marketing site + account center + download center + admin/stats dashboards). This is an early-stage prototype: pages render mock/hardcoded data and most "backend" calls are simulated. Chinese-language UI strings are used throughout (this is intentional, not a placeholder).

Two independent app halves live in this repo:
- **Frontend**: Nuxt 4 / Vue 3 SPA at the repo root.
- **Backend**: a bare-bones Spring Boot 3 (Java 21) service in `backend/`, currently just a stub `MailController` mirroring the frontend's mock mail API. It has no `settings.gradle`, no Gradle wrapper, and no `application.properties` yet — it is not runnable as-is without adding those.

## Commands

Frontend (run from repo root):
```bash
npm install       # install deps (also runs `nuxt prepare` via postinstall)
npm run dev        # dev server at http://localhost:3000
npm run build       # production build
npm run preview     # preview a production build locally
npm run generate     # static site generation
```

There is no lint, test, or typecheck script configured in `package.json` — don't assume one exists.

Backend (`backend/`): the `build.gradle` declares a standard Spring Boot/JPA/Redis/Flyway stack, but there is no Gradle wrapper or `settings.gradle` checked in, so `./gradlew` will not work until those are added.

## Architecture

**Routing**: File-based via `pages/*.vue` (Nuxt convention) — `index.vue` (marketing home + login modal), `account.vue`, `download.vue`, `admin.vue`, `stats.vue`. There are no `components/` or `layouts/` directories yet: each page is a large, self-contained single-file component with its own markup, state, and mock data inline. When adding shared UI, check whether a `components/` directory should be introduced rather than copy-pasting page markup.

**State**: Pinia store at `stores/auth.ts` (`useAuthStore`) holds email/code/login state and simulates the verification-code flow. It calls `POST {apiBase}/api/mail` and falls back to a hardcoded "success" alert if the request fails — this is deliberate demo behavior, not a bug.

**Config**: `nuxt.config.ts` exposes `runtimeConfig.public.apiBase`, sourced from `API_URL` env var, defaulting to `http://127.0.0.1:8080`. This is how the frontend locates the Spring Boot API.

**Mock API layer**: `server/api/mail.ts` is a Nuxt/Nitro server route that simulates the mail-gateway response (validates a 6-digit code, logs to console, returns a canned template). `backend/.../MailController.java` is the Spring Boot equivalent of the same simulated endpoint — the two are meant to converge as the real backend is built out, so keep their request/response shapes in sync when editing either.

**Deployment**: `docker-compose.yml` defines the target production topology — `product-server` (this Nuxt app), `api` (Spring Boot), `postgres`, `redis`, `mail-gateway` (SMTP relay via Google SMTP), and `nginx` as reverse proxy/SSL terminator for `dash.magies.top`. `nginx.conf` routes `/` to the product server and `/api/` to the Spring Boot API. Note several of these services (`mail-gateway` build context, `ssl/` certs) don't exist in the repo yet — the compose file describes the intended end state, not the current runnable state.

## Styling

Tailwind CSS v4 (via `postcss.config.js` + `tailwind.config.js`), scanning `components/`, `pages/`, `app/`, `layouts/`, `plugins/`. Pages use utility classes directly with no design-system/component abstraction layer currently.
