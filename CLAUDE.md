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
- Browser calls same-origin `/api/*`; production nginx proxies to Spring Boot on `127.0.0.1:8111`.
- Dev: `nitro.devProxy` forwards `/api` to `http://127.0.0.1:8080/api`.
- Auth: `POST /api/auth/send-code` → Redis/memory code (5 min) → Mail Gateway → `POST /api/auth/verify` → JWT.
- Seed admin: `admin@magies.top`.
- Seed products: Magies Nav / HRP / Game / Hub via Flyway `V1__init.sql`.

## Ports (compose, localhost only)

- product-server: `127.0.0.1:8110`
- api: `127.0.0.1:8111`
- mail-gateway: `127.0.0.1:8090`

## Production host

- Server: `ubuntu@150.230.47.207` (`qi`), key `~/Downloads/ssh-key-2026-03-27.key`
- App dir: `/home/ubuntu/MagiesNavDash`
- Public: `https://dash.magies.top`

### Deploy

Pull on the server — the repo is public, so no credentials are needed. Only
committed, pushed code can ship, and `git` never touches untracked files, so
the server's `.env` is safe.

```bash
ssh -i ~/Downloads/ssh-key-2026-03-27.key ubuntu@150.230.47.207
cd /home/ubuntu/MagiesNavDash
git fetch origin && git checkout -f -B <branch> origin/<branch>
sudo docker compose up --build -d
```

Rollback: `git checkout -f <commit>` then rebuild.

When `nginx.conf` changes, install it and **always gate the reload on the test** —
this host also serves games/hrp/nav, so a bad config takes them down too:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/dash.magies.top
sudo nginx -t && sudo systemctl reload nginx
```

Do **not** deploy by `rsync --delete`. `.env` is gitignored and therefore absent
from the working tree, so `--delete` removes it from the server and compose then
fails on `POSTGRES_PASSWORD`. If rsync is ever used anyway, pass
`--exclude '.env'`.
