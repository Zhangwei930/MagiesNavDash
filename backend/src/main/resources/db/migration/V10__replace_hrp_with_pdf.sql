-- Magies HRP 下线：始终没有对应的真实服务，产品矩阵里的这个位置交给 Magies PDF。
-- Magies PDF 目前同样还没有上线服务，先以开发中状态进入矩阵，不给 homepage_url。

-- download_log 的外键没有 ON DELETE CASCADE，得先清掉引用；
-- product_feature / product_release 会随产品级联删除。
DELETE FROM product_download_log
WHERE product_id IN (SELECT id FROM product WHERE slug = 'magies-hrp');

DELETE FROM product WHERE slug = 'magies-hrp';

INSERT INTO product (category_id, name, slug, tagline, description, icon, accent_color, homepage_url, status, sort_order)
SELECT
    (SELECT id FROM product_category WHERE slug = 'business'),
    'Magies PDF',
    'magies-pdf',
    'PDF 文档处理与批量转换',
    '面向企业与个人文档场景的 PDF 处理能力。规划能力包括合并拆分、格式转换、压缩优化与批量处理。服务尚未上线。',
    'file-text',
    '#6366f1',
    NULL,
    'IN_DEVELOPMENT',
    30
WHERE NOT EXISTS (SELECT 1 FROM product WHERE slug = 'magies-pdf');

INSERT INTO product_feature (product_id, title, description, sort_order)
SELECT p.id, f.title, f.description, f.sort_order
FROM product p
CROSS JOIN (
    SELECT '合并与拆分' AS title, '按页范围拆分、多文档合并与页面重排' AS description, 1 AS sort_order
    UNION ALL SELECT '格式转换', 'PDF 与 Office、图片格式之间互转', 2
    UNION ALL SELECT '压缩与优化', '在可接受清晰度下压缩体积，便于分发与归档', 3
    UNION ALL SELECT '批量处理', '同一套规则应用到整批文档', 4
) f
WHERE p.slug = 'magies-pdf'
  AND NOT EXISTS (SELECT 1 FROM product_feature pf WHERE pf.product_id = p.id);
