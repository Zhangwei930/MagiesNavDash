INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, sort_order, status)
SELECT 1, 'Magies Shell', 'magies-shell', '终端与运维', 'Magies Shell 终端工具，远程连接与运维入口。', 'terminal', '#22d3ee', 'https://shell.magies.top', 0, 'PUBLISHED'
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-shell');
