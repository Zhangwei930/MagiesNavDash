-- MagiesTerminal 有了独立官网 shell.magies.top（母品牌 Magies Hub / 子产品 MagiesTerminal）。
-- 把 Hub 里那条占位数据对齐到官网：官方写法连写、官网文案、官网品牌色，
-- 下载不在 Hub 托管，直接指向官网下载区。

UPDATE product
SET name         = 'MagiesTerminal',
    tagline      = 'AI 驱动的 SSH 工作空间',
    description  = 'AI 驱动的 SSH 客户端、SFTP 浏览器与终端管理器。Vault、分屏、端口转发、Mosh，以及内置 Agent，为日常运维而生。',
    accent_color = '#2ad4c8',
    homepage_url = 'https://shell.magies.top',
    icon         = 'terminal',
    updated_at   = CURRENT_TIMESTAMP
WHERE slug = 'magies-terminal';

INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, v.title, v.description, v.sort_order
FROM product p
CROSS JOIN (VALUES
    ('SSH / Mosh / Telnet', '多协议连接，弱网下 Mosh 保持会话不断', 1),
    ('SFTP 浏览器', '图形化文件传输与远程编辑', 2),
    ('Vault 凭据管理', '密钥与密码集中加密存放', 3),
    ('分屏与端口转发', '多会话并排，本地与远程端口映射', 4),
    ('内置 AI Agent', '让 Agent 读取终端上下文并代跑命令', 5)
) AS v(title, description, sort_order)
WHERE p.slug = 'magies-terminal'
  AND NOT EXISTS (
      SELECT 1 FROM product_feature f WHERE f.product_id = p.id AND f.title = v.title
  );

-- 安装包由官网分发（macOS / Windows / Linux / Android 各自的包），
-- Hub 只记录版本并把用户送到官网下载区，所以没有 file_size / signature。
INSERT INTO product_release (product_id, version, channel, changelog, download_url, file_size, platform, is_latest)
SELECT p.id, '0.5.28', 'stable',
       '内置 Agent、Vault 凭据管理、SFTP 浏览器与端口转发',
       'https://shell.magies.top/#download',
       0, 'macOS / Windows / Linux / Android', TRUE
FROM product p
WHERE p.slug = 'magies-terminal'
  AND NOT EXISTS (
      SELECT 1 FROM product_release r WHERE r.product_id = p.id AND r.version = '0.5.28'
  );
