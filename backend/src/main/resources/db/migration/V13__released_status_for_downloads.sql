-- Terminal and Office are officially released products, not "open / beta".
UPDATE product
SET status = 'RELEASED',
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('magies-terminal', 'magies-office', 'magies-pdf');
