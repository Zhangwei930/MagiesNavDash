-- Magies Game is live at tech.magies.top — leave Labs / experimental for
-- true experiments; Online Services is the correct product line.

UPDATE product
SET category_id  = (SELECT id FROM product_category WHERE slug = 'online'),
    name         = 'Magies Game',
    tagline      = '游戏与技术在线服务',
    description  = '面向游戏与技术场景的在线服务，浏览器即可使用。入口：https://tech.magies.top',
    homepage_url = 'https://tech.magies.top',
    status       = 'ONLINE',
    accent_color = '#94a3b8',
    icon         = 'gamepad',
    updated_at   = CURRENT_TIMESTAMP
WHERE slug = 'magies-game';
