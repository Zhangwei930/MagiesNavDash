-- Magies HRP 与 Magies Game 是 V1 的种子演示数据，从来没有对应的真实服务
-- （hrp.magies.top 返回 404，game.magies.top 无法访问，release 签名也是占位串）。
-- 真实在线的只有 MagiesTerminal / Magies Nav / Magies Hub。

-- download_log 的外键没有 ON DELETE CASCADE，得先清掉引用；
-- product_feature / product_release 会随产品级联删除。
DELETE FROM product_download_log
WHERE product_id IN (SELECT id FROM product WHERE slug IN ('magies-hrp', 'magies-game'));

DELETE FROM product WHERE slug IN ('magies-hrp', 'magies-game');
