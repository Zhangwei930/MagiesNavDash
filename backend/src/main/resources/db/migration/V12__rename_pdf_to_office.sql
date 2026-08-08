-- Magies PDF rebrands to Magies Office. Binary source (GitHub MagiesPdf /
-- dl.magies.top/magiespdf) is unchanged; only product identity on the hub moves.

UPDATE product
SET name         = 'Magies Office',
    slug         = 'magies-office',
    tagline      = '本地优先的跨平台 Office 与 PDF 工具箱',
    description  = '合并、拆分、格式转换、OCR、涂黑与签名，全部在本机完成，文档不出设备。提供 macOS、Windows 与 Linux 安装包。',
    icon         = 'file-text',
    updated_at   = CURRENT_TIMESTAMP
WHERE slug = 'magies-pdf';

UPDATE product_release
SET changelog    = '本地优先的跨平台 Office 与 PDF 工具箱：合并、拆分、转换、OCR、涂黑与签名，全部在本机完成。',
    download_url = 'https://github.com/Zhangwei930/MagiesPdf/releases/latest'
WHERE product_id IN (SELECT id FROM product WHERE slug = 'magies-office');

-- Terminal installs are also served from the live release feed on the download
-- page (same mirror/GitHub pattern as shell.magies.top). Keep the release row
-- so the card still appears when the feed is briefly unavailable.
UPDATE product_release
SET download_url = 'https://dl.magies.top/stable',
    platform     = 'macOS / Windows / Linux / Android'
WHERE is_latest = TRUE
  AND product_id IN (SELECT id FROM product WHERE slug = 'magies-terminal');
