-- Magies Game official host is games.magies.top (not tech.magies.top).
UPDATE product
SET homepage_url = 'https://games.magies.top',
    description  = CASE
        WHEN description IS NOT NULL AND description LIKE '%tech.magies.top%'
            THEN replace(description, 'tech.magies.top', 'games.magies.top')
        ELSE description
    END,
    updated_at   = CURRENT_TIMESTAMP
WHERE slug = 'magies-game';
