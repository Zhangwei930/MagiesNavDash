-- 分类定为：工具站 / 终端 / 导航站，三个产品各归各位。
-- 「平台」这一行改作「导航站」，同样是改名而不是删建，避免 category_id 悬空。

UPDATE product_category SET name = '导航站', slug = 'nav', sort_order = 3 WHERE slug = 'platform';

INSERT INTO product_category (name, slug, sort_order)
SELECT '导航站', 'nav', 3
WHERE NOT EXISTS (SELECT 1 FROM product_category WHERE slug = 'nav');

UPDATE product
SET category_id = (SELECT id FROM product_category WHERE slug = 'terminal'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('magies-terminal', 'magies-shell');

UPDATE product
SET category_id = (SELECT id FROM product_category WHERE slug = 'nav'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-nav';

UPDATE product
SET category_id = (SELECT id FROM product_category WHERE slug = 'tools'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'magies-hub';
