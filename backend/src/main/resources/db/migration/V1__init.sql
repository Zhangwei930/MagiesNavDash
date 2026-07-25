CREATE TABLE IF NOT EXISTS sys_user (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    display_name    VARCHAR(128),
    password_hash   VARCHAR(255),
    role            VARCHAR(32)  NOT NULL DEFAULT 'USER',
    status          VARCHAR(32)  NOT NULL DEFAULT 'ACTIVE',
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_category (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(128) NOT NULL,
    slug        VARCHAR(128) NOT NULL UNIQUE,
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product (
    id              BIGSERIAL PRIMARY KEY,
    category_id     BIGINT REFERENCES product_category(id),
    name            VARCHAR(128) NOT NULL,
    slug            VARCHAR(128) NOT NULL UNIQUE,
    tagline         VARCHAR(255),
    description     TEXT,
    icon            VARCHAR(64),
    accent_color    VARCHAR(32) DEFAULT '#22d3ee',
    status          VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
    homepage_url    VARCHAR(512),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_feature (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    title       VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_release (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    version         VARCHAR(64) NOT NULL,
    channel         VARCHAR(32) NOT NULL DEFAULT 'stable',
    changelog       TEXT,
    download_url    VARCHAR(1024),
    signature       VARCHAR(1024),
    file_size       BIGINT DEFAULT 0,
    platform        VARCHAR(64) NOT NULL DEFAULT 'universal',
    published_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_latest       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS product_download_log (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT REFERENCES product(id),
    release_id      BIGINT REFERENCES product_release(id),
    user_id         BIGINT REFERENCES sys_user(id),
    ip              VARCHAR(64),
    user_agent      VARCHAR(512),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_access_log (
    id              BIGSERIAL PRIMARY KEY,
    path            VARCHAR(512),
    ip              VARCHAR(64),
    user_agent      VARCHAR(512),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES sys_user(id),
    email           VARCHAR(255),
    content         TEXT NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mail_log (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL,
    mail_type       VARCHAR(64) NOT NULL,
    subject         VARCHAR(255),
    status          VARCHAR(32) NOT NULL,
    provider_msg    VARCHAR(512),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mail_template (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(64) NOT NULL UNIQUE,
    subject         VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product_category (name, slug, sort_order) VALUES
    ('工具站', 'tools', 1),
    ('企业应用', 'enterprise', 2),
    ('平台服务', 'platform', 3);

INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, sort_order) VALUES
    (1, 'Magies Nav', 'magies-nav', '智能导航门户', '统一入口管理内部系统与外部工具，支持分组、收藏与权限过滤，让团队一键到达。', '🧭', '#38bdf8', 'https://nav.magies.top', 1),
    (2, 'Magies HRP', 'magies-hrp', '人事资源平台', '覆盖组织架构、考勤、审批与员工档案的轻量人事系统，适合成长型团队快速落地。', '👥', '#a78bfa', 'https://hrp.magies.top', 2),
    (1, 'Magies Game', 'magies-game', '游戏运营中台', '游戏活动、账号与运营数据的统一控制台，支撑发行与运营日常节奏。', '🎮', '#34d399', 'https://game.magies.top', 3),
    (3, 'Magies Hub', 'magies-hub', '产品生态中心', '本站：产品官网、账号、下载、后台与邮件中心一体化，成为 Magies 产品生态的统一门户。', '✦', '#22d3ee', 'https://dash.magies.top', 4);

INSERT INTO product_feature (product_id, title, description, sort_order) VALUES
    (1, '统一入口', '聚合多系统链接与快捷工具', 1),
    (1, '权限过滤', '按角色展示可见导航', 2),
    (1, '收藏置顶', '个人工作台一键可达', 3),
    (2, '组织架构', '部门与岗位清晰可视', 1),
    (2, '审批流', '请假与报销轻量配置', 2),
    (3, '活动配置', '运营活动快速上线', 1),
    (3, '数据看板', '核心指标实时查看', 2),
    (4, '账号中心', '邮箱验证码登录注册', 1),
    (4, '签名下载', '版本包签名校验', 2),
    (4, '邮件中心', '验证码与通知统一出口', 3);

INSERT INTO product_release (product_id, version, channel, changelog, download_url, signature, file_size, platform, is_latest) VALUES
    (1, '1.2.0', 'stable', '导航分组优化、暗色主题、收藏同步', '/downloads/magies-nav-1.2.0.zip', 'sha256:nav-1.2.0-sig', 18432000, 'universal', TRUE),
    (2, '0.9.1', 'stable', '考勤导出、审批提醒', '/downloads/magies-hrp-0.9.1.zip', 'sha256:hrp-0.9.1-sig', 22610000, 'universal', TRUE),
    (3, '2.0.0', 'stable', '运营看板重构、活动模板库', '/downloads/magies-game-2.0.0.zip', 'sha256:game-2.0.0-sig', 31240000, 'universal', TRUE),
    (4, '1.0.0', 'stable', 'Magies Hub Enterprise 首发：官网 / 账号 / 下载 / 后台', '/downloads/magies-hub-1.0.0.zip', 'sha256:hub-1.0.0-sig', 15800000, 'universal', TRUE);

INSERT INTO mail_template (code, subject, body) VALUES
    ('VERIFY_CODE', '【Magies Hub】登录验证码', '您的验证码是：{{code}}\n有效期：5 分钟\n如非本人操作，请忽略此邮件。'),
    ('WELCOME', '欢迎加入 Magies Hub', '欢迎 {{email}}，您的账号已创建成功。');

INSERT INTO sys_user (email, display_name, role, status) VALUES
    ('admin@magies.top', '管理员', 'ADMIN', 'ACTIVE');
