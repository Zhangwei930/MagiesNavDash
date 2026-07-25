-- Magies Nav 与 Magies Hub 是网页应用，没有安装包可下载。
-- 它们在 V1 里的 release 是占位数据：签名形如 'sha256:nav-1.2.0-sig'，
-- file_size 是编的，download_url 指向服务器上并不存在的 /downloads/*.zip。
-- 留着只会让下载按钮 404，删掉之后详情页会自动隐藏「版本与下载」区块。
-- MagiesTerminal 的 0.5.28 是真实版本，保留。

DELETE FROM product_download_log
WHERE release_id IN (
    SELECT r.id
    FROM product_release r
    JOIN product p ON p.id = r.product_id
    WHERE p.slug IN ('magies-nav', 'magies-hub')
);

DELETE FROM product_release
WHERE product_id IN (SELECT id FROM product WHERE slug IN ('magies-nav', 'magies-hub'));
