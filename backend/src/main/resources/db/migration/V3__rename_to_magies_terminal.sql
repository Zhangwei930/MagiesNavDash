-- 产品名统一为 Magies Terminal（链接仍为 shell.magies.top）
UPDATE product
SET name = 'Magies Terminal',
    slug = 'magies-terminal',
    tagline = '终端与运维',
    description = 'Magies Terminal 终端工具，远程连接与运维入口。',
    homepage_url = 'https://shell.magies.top',
    icon = 'terminal',
    accent_color = '#22d3ee',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-shell';

UPDATE product
SET name = 'Magies Terminal',
    tagline = '终端与运维',
    description = 'Magies Terminal 终端工具，远程连接与运维入口。',
    homepage_url = 'https://shell.magies.top',
    icon = 'terminal',
    accent_color = '#22d3ee',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-terminal';

INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, sort_order, status)
SELECT 1, 'Magies Terminal', 'magies-terminal', '终端与运维', 'Magies Terminal 终端工具，远程连接与运维入口。', 'terminal', '#22d3ee', 'https://shell.magies.top', 0, 'PUBLISHED'
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-terminal')
  AND NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-shell');
