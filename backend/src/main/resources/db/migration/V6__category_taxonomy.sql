-- 分类名单定为：工具站 / 终端 / 平台。
-- 复用现有行而不是删了重建，避免 product.category_id 悬空。

UPDATE product_category SET name = '工具站', sort_order = 1 WHERE slug = 'tools';

-- 「企业应用」不再需要，这一行改作「终端」。
UPDATE product_category SET name = '终端', slug = 'terminal', sort_order = 2 WHERE slug = 'enterprise';

-- 若 enterprise 已被后台删掉，补建「终端」。
INSERT INTO product_category (name, slug, sort_order)
SELECT '终端', 'terminal', 2
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'terminal');

UPDATE product_category SET name = '平台', sort_order = 3 WHERE slug = 'platform';

INSERT INTO product_category (name, slug, sort_order)
SELECT '平台', 'platform', 3
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'platform');

-- 归属：Terminal 与 Nav 进工具站，Hub 进平台。
UPDATE product
SET category_id = (SELECT id FROM product_category WHERE slug = 'tools'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('magies-terminal', 'magies-shell', 'magies-nav');

UPDATE product
SET category_id = (SELECT id FROM product_category WHERE slug = 'platform'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-hub';
