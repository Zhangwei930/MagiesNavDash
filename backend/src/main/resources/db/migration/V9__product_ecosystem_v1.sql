-- Magies 产品生态官网 V1：四条产品线 + Labs，产品状态与矩阵对齐建设方案。
-- 复用/改名现有分类，避免 category_id 悬空。

-- ── 产品线分类 ──────────────────────────────────────────────
UPDATE product_category SET name = 'Developer Tools', slug = 'developer-tools', sort_order = 1
WHERE slug IN ('tools', 'developer-tools');

INSERT INTO product_category (name, slug, sort_order)
SELECT 'Developer Tools', 'developer-tools', 1
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'developer-tools');

UPDATE product_category SET name = 'Data & Automation', slug = 'data-automation', sort_order = 2
WHERE slug IN ('terminal', 'data-automation');

INSERT INTO product_category (name, slug, sort_order)
SELECT 'Data & Automation', 'data-automation', 2
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'data-automation');

UPDATE product_category SET name = 'Business Solutions', slug = 'business', sort_order = 3
WHERE slug IN ('nav', 'business', 'platform', 'enterprise');

INSERT INTO product_category (name, slug, sort_order)
SELECT 'Business Solutions', 'business', 3
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'business');

INSERT INTO product_category (name, slug, sort_order)
SELECT 'Online Services', 'online', 4
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'online');

INSERT INTO product_category (name, slug, sort_order)
SELECT 'Magies Labs', 'labs', 5
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'labs');

-- 清理不再使用的旧分类（无产品引用时）
DELETE FROM product_category
WHERE slug IN ('tools', 'terminal', 'nav', 'platform', 'enterprise')
  AND slug NOT IN ('developer-tools', 'data-automation', 'business', 'online', 'labs')
  AND id NOT IN (SELECT DISTINCT category_id FROM product WHERE category_id IS NOT NULL);

-- ── 现有产品：归属 + 状态 + 文案 ────────────────────────────
UPDATE product SET
    category_id = (SELECT id FROM product_category WHERE slug = 'developer-tools'),
    name = 'Magies Terminal',
    tagline = 'AI 驱动的 SSH 与远程运维工作空间',
    description = '面向开发者与运维人员的远程连接与日常运维工作台。少切换、少记忆，把连接、传输与常用运维能力收在一个入口。',
    icon = 'terminal',
    accent_color = '#2ad4c8',
    homepage_url = 'https://shell.magies.top',
    status = 'PUBLIC_BETA',
    sort_order = 10,
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('magies-terminal', 'magies-shell');

UPDATE product SET
    category_id = (SELECT id FROM product_category WHERE slug = 'online'),
    name = 'Magies Nav',
    tagline = '连接工具、服务和常用入口',
    description = '统一入口管理内部系统与外部工具，支持分组、收藏与快捷到达。无需复杂安装，打开即用。',
    icon = 'compass',
    accent_color = '#60a5fa',
    homepage_url = 'https://nav.magies.top',
    status = 'ONLINE',
    sort_order = 20,
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-nav';

-- Hub 是本站门户本身，不进公开产品矩阵（后台仍可管理）
UPDATE product SET
    category_id = (SELECT id FROM product_category WHERE slug = 'online'),
    name = 'Magies Hub',
    tagline = '品牌官网、账号与下载入口',
    description = 'Magies 产品生态的统一门户：产品发现、账号、下载与运营后台。',
    icon = 'boxes',
    accent_color = '#c084fc',
    homepage_url = 'https://dash.magies.top',
    status = 'HIDDEN',
    sort_order = 90,
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-hub';

-- ── 新产品 ─────────────────────────────────────────────────
INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, status, sort_order)
SELECT
    (SELECT id FROM product_category WHERE slug = 'data-automation'),
    'Magies Data Studio',
    'magies-data-studio',
    '通用数据采集、转换与自动化工作台',
    '面向采集、运营与数据分析人员的数据自动化产品。规划能力包括网页采集、数据清洗、格式转换、定时任务、PostgreSQL 入库与轻量执行器。',
    'database',
    '#22d3ee',
    NULL,
    'IN_DEVELOPMENT',
    15
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-data-studio');

INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, status, sort_order)
SELECT
    (SELECT id FROM product_category WHERE slug = 'business'),
    'Magies HRP',
    'magies-hrp',
    '企业业务与人力资源方案',
    '面向企业与行业场景的业务系统能力，覆盖组织、人事与流程落地。需要咨询、实施或授权。',
    'users',
    '#6366f1',
    NULL,
    'ENTERPRISE',
    30
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-hrp');

INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, status, sort_order)
SELECT
    (SELECT id FROM product_category WHERE slug = 'labs'),
    'Magies Game',
    'magies-game',
    '游戏相关探索项目',
    '处于探索阶段的实验项目，方向可能调整，不承诺稳定性与正式支持。',
    'gamepad',
    '#94a3b8',
    NULL,
    'EXPERIMENTAL',
    80
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-game');

-- ── 功能要点（仅在尚无 feature 时写入）──────────────────────
INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, f.title, f.description, f.sort_order
FROM product p
CROSS JOIN (
    SELECT '一键进入运维环境' AS title, '从统一入口快速打开远程会话' AS description, 1 AS sort_order
    UNION ALL SELECT 'SSH 与远程工作流', '连接、传输与日常巡检收拢到同一工作台', 2
    UNION ALL SELECT '持续迭代的终端体验', 'Public Beta，功能与体验持续改进', 3
) f
WHERE p.slug IN ('magies-terminal', 'magies-shell')
  AND NOT EXISTS (SELECT 1 FROM product_feature pf WHERE pf.product_id = p.id);

INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, f.title, f.description, f.sort_order
FROM product p
CROSS JOIN (
    SELECT '统一入口' AS title, '聚合多系统链接与快捷工具' AS description, 1 AS sort_order
    UNION ALL SELECT '分组与收藏', '按场景整理，个人工作台一键可达', 2
    UNION ALL SELECT '在线即用', '无需安装客户端，浏览器直接打开', 3
) f
WHERE p.slug = 'magies-nav'
  AND NOT EXISTS (SELECT 1 FROM product_feature pf WHERE pf.product_id = p.id);

INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, f.title, f.description, f.sort_order
FROM product p
CROSS JOIN (
    SELECT '网页采集' AS title, '按流程采集结构化与半结构化数据' AS description, 1 AS sort_order
    UNION ALL SELECT '清洗与转换', '格式整理、字段映射与可重复流水线', 2
    UNION ALL SELECT '定时与入库', '任务调度、监控与 PostgreSQL 入库', 3
    UNION ALL SELECT '轻量执行器', '可部署的执行节点，便于本地与服务器跑任务', 4
) f
WHERE p.slug = 'magies-data-studio'
  AND NOT EXISTS (SELECT 1 FROM product_feature pf WHERE pf.product_id = p.id);

INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, f.title, f.description, f.sort_order
FROM product p
CROSS JOIN (
    SELECT '组织与人事' AS title, '组织架构、档案与人事流程' AS description, 1 AS sort_order
    UNION ALL SELECT '业务落地', '按行业场景实施与集成', 2
    UNION ALL SELECT '可靠交付', '咨询、实施与持续运维支持', 3
) f
WHERE p.slug = 'magies-hrp'
  AND NOT EXISTS (SELECT 1 FROM product_feature pf WHERE pf.product_id = p.id);
