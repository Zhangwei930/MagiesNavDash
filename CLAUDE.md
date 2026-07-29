# CLAUDE.md

Guidance for working in this repository.

## What this is

Magies Hub Enterprise — unified product portal:

- 工具站 / 产品中心
- 账号中心（邮箱验证码 + JWT）
- 下载中心（签名 + 下载日志）
- 后台管理 / 统计
- 邮件中心（独立 Mail Gateway）

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Nuxt 4, Vue 3, Tailwind 4 (`@tailwindcss/vite`), Pinia |
| Backend | Spring Boot 3.3, JPA, Flyway, Redis, JWT |
| Mail | `mail-gateway/` Node HTTP service |
| Deploy | Docker Compose + host nginx (`nginx.conf`) |

## Commands

Frontend:
```bash
npm install
npm run dev      # :3000, proxies /api → :8080
npm run build
```

Backend:
```bash
cd backend
./gradlew bootRun   # :8080, default H2 in-memory
./gradlew bootJar
```

Mail gateway:
```bash
cd mail-gateway && node server.js   # :8090
```

Docker:
```bash
docker compose up --build -d
```

## Architecture notes

- Frontend lives under `app/` (Nuxt 4 convention).
- Browser calls same-origin `/api/*`; production nginx proxies to Spring Boot on `127.0.0.1:8411`.
- Dev: `nitro.devProxy` forwards `/api` to `http://127.0.0.1:8080/api`.
- Auth: `POST /api/auth/send-code` → Redis/memory code (5 min) → Mail Gateway → `POST /api/auth/verify` → JWT.
- Seed admin: `admin@magies.top`.
- Seed products: Magies Nav / HRP / Game / Hub via Flyway `V1__init.sql`.

## Ports (compose, localhost only)

- product-server: `127.0.0.1:8410`
- api: `127.0.0.1:8411`
- mail-gateway: `127.0.0.1:8412`

(8110 / 8090 are already used by other services on the production host.)

## Production host

- Server: `aao-server` (`root@129.146.112.178`)
- App dir: `/opt/magies-hub`
- Public: `https://dash.magies.top`
- Deploy: rsync/git pull + `docker compose up --build -d` + install `nginx.conf`
