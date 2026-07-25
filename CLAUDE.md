# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Magies Hub — a unified product portal (marketing site + account center + download center + admin/stats dashboards). This is an early-stage prototype: pages render mock/hardcoded data and most "backend" calls are simulated. Chinese-language UI strings are used throughout (this is intentional, not a placeholder).

Two independent app halves live in this repo:
- **Frontend**: Nuxt 4 / Vue 3 SPA at the repo root.
- **Backend**: a bare-bones Spring Boot 3 (Java 21) service in `backend/`, currently just a stub `MailController` mirroring the frontend's mock mail API. It has no `application.properties` yet, so it will build and boot but has no real datasource/config wired up.

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

Backend (`backend/`):
```bash
./gradlew build   # compiles + runs tests + produces build/libs/*.jar (auto-provisions a JDK 21 toolchain via the Foojay resolver if none is installed)
./gradlew bootRun  # run locally
```
`build.gradle` declares a standard Spring Boot/JPA/Redis/Flyway stack targeting Java 21.

Docker images: `Dockerfile` (root, builds the Nuxt frontend) and `backend/Dockerfile` (builds the Spring Boot jar) are multi-stage builds matching what `docker-compose.yml` expects at `build: .` / `build: ./backend`.

## Architecture

**Routing**: File-based via `app/pages/*.vue` (Nuxt 4 convention — `srcDir` is `app/` since `app/app.vue` exists) — `index.vue` (marketing home + login modal), `account.vue`, `download.vue`, `admin.vue`, `stats.vue`. There are no `components/` or `layouts/` directories yet: each page is a large, self-contained single-file component with its own markup, state, and mock data inline. When adding shared UI, check whether a `components/` directory should be introduced rather than copy-pasting page markup. `<script setup>` must be a top-level sibling of `<template>`, not nested inside it — Vue's SFC parser won't recognize a nested one, silently leaving the template's bindings undefined.

**State**: Pinia store at `app/stores/auth.ts` (`useAuthStore`) holds email/code/login state and simulates the verification-code flow. It calls `POST {apiBase}/api/mail` and falls back to a hardcoded "success" alert if the request fails — this is deliberate demo behavior, not a bug. Requires the `@pinia/nuxt` module (registered in `nuxt.config.ts`) to have an active Pinia instance during SSR.

**Config**: `nuxt.config.ts` exposes `runtimeConfig.public.apiBase`, sourced from `API_URL` env var, defaulting to `http://127.0.0.1:8080`. This is how the frontend locates the Spring Boot API.

**Mock API layer**: `server/api/mail.ts` is a Nuxt/Nitro server route that simulates the mail-gateway response (validates a 6-digit code, logs to console, returns a canned template). `backend/.../MailController.java` is the Spring Boot equivalent of the same simulated endpoint — the two are meant to converge as the real backend is built out, so keep their request/response shapes in sync when editing either.

**Deployment**: the target server is shared with sibling projects (`games.magies.top`, `hrp.magies.top`, `nav.magies.top`) and runs a single host-level nginx (systemd, not containerized) that owns ports 80/443 for all of them. So `docker-compose.yml` only publishes `product-server` (port 3000) and `api` (port 8080) to `127.0.0.1` — it does not run its own nginx/SSL container. `nginx.conf` in this repo is a host vhost file (not a container config) meant to be copied to `/etc/nginx/sites-available/dash.magies.top` on the server, following the same pattern as the existing `nav.magies.top` vhost (Cloudflare-origin certs at `/etc/ssl/cloudflare/`, proxying `/` and `/api/` to the two `127.0.0.1` ports above). `mail-gateway`'s build context (`./mail-gateway`) still doesn't exist in the repo — that service isn't runnable yet.

## Styling

Tailwind CSS v4 (via `postcss.config.js` + `tailwind.config.js`), scanning `components/`, `pages/`, `app/`, `layouts/`, `plugins/`. Pages use utility classes directly with no design-system/component abstraction layer currently.
