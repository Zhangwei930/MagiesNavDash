-- Magies PDF has shipped real builds (github.com/Zhangwei930/MagiesPdf), so it
-- leaves IN_DEVELOPMENT. Terminal moves off PUBLIC_BETA onto the same label.
-- OPEN is downloadable, which is what turns the download page cards on.
UPDATE product SET status = 'OPEN' WHERE slug IN ('magies-pdf', 'magies-terminal');

-- V10 seeded PDF as an unreleased placeholder; that copy is now wrong.
UPDATE product
SET tagline = '本地优先的跨平台 PDF 工具箱',
    description = '合并、拆分、格式转换、OCR、涂黑与签名，全部在本机完成，文档不出设备。提供 macOS、Windows 与 Linux 安装包。'
WHERE slug = 'magies-pdf';
-- homepage_url stays NULL on purpose: primaryAction() sends products with a
-- homepage to "use", and this one should send people to the download page.

-- Give Magies PDF a release row so it appears on the download page alongside
-- Terminal. The per-platform files and the version shown are read live from the
-- release feed, so download_url here points at the product page rather than a
-- single platform's binary, and file_size stays 0.
INSERT INTO product_release (product_id, version, channel, changelog, download_url, signature, file_size, platform, published_at, is_latest)
SELECT
    p.id,
    '1.0.1',
    'stable',
    '本地优先的跨平台 PDF 工具箱：合并、拆分、转换、OCR、涂黑与签名，全部在本机完成。',
    'https://github.com/Zhangwei930/MagiesPdf/releases/latest',
    NULL,
    0,
    'macOS / Windows / Linux',
    NOW(),
    TRUE
FROM product p
WHERE p.slug = 'magies-pdf'
  AND NOT EXISTS (SELECT 1 FROM product_release r WHERE r.product_id = p.id);
