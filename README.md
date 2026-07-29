# Magies Hub Enterprise

统一产品门户：工具站 · 账号中心 · 下载中心 · 后台管理 · 邮件中心。

- 前端：Nuxt 4 + Vue 3 + Tailwind CSS 4 + Pinia  
- 后端：Spring Boot 3 + JPA + Flyway + Redis + JWT  
- 邮件：独立 Mail Gateway  
- 部署：Docker Compose + 主机 Nginx（`dash.magies.top`）

## 本地开发

### 1. 后端 API（8080）

```bash
cd backend
export JAVA_HOME=... # Java 17+
./gradlew bootRun
```

默认使用内存 H2；生产由 Docker 注入 PostgreSQL。

### 2. 邮件网关（8090）

```bash
cd mail-gateway
node server.js
```

### 3. 前端（3000）

```bash
npm install
npm run dev
```

开发环境通过 Nitro 把 `/api` 代理到 `http://127.0.0.1:8080/api`。

## 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/products` | 工具站产品列表 |
| GET | `/api/products/{slug}` | 产品详情 |
| GET | `/api/releases/latest` | 最新版本 |
| POST | `/api/downloads` | 记录下载并返回签名 |
| POST | `/api/auth/send-code` | 发送验证码 |
| POST | `/api/auth/verify` | 校验并登录（JWT） |
| GET | `/api/stats/public` | 公开统计 |
| GET | `/api/admin/dashboard` | 后台（需 ADMIN） |

种子管理员：`admin@magies.top`（邮箱验证码登录）。

## Docker 部署

```bash
cp .env.example .env
docker compose up --build -d
```

端口（仅本机，生产机避开 8110/8090 占用）：

- 前端 `127.0.0.1:8410`
- API `127.0.0.1:8411`
- Mail Gateway `127.0.0.1:8412`

主机 Nginx 配置见仓库根目录 `nginx.conf`，安装到 `/etc/nginx/conf.d/dash.magies.top.conf` 后 `nginx -t && systemctl reload nginx`。

## 页面

- `/` 品牌首页（产品线 · 重点产品 · 场景 · 统一体验）
- `/products` 产品中心（按产品线 / 状态筛选）
- `/products/:slug` 产品详情
- `/solutions` · `/solutions/:slug` 解决方案
- `/download` 下载中心
- `/roadmap` 路线图 · `/changelog` 更新日志
- `/about` 关于 · `/contact` 联系
- `/privacy` · `/terms` · `/security` 信任页
- `/account` 账号中心 · `/admin` 后台 · `/stats` 统计
