-- Analytics events for Magies Hub stats dashboard (mirrors Terminal shell_events).
CREATE TABLE IF NOT EXISTS hub_events (
    id              BIGSERIAL PRIMARY KEY,
    ts              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type      VARCHAR(32) NOT NULL CHECK (event_type IN ('page_view', 'download')),
    ip              VARCHAR(64),
    country         VARCHAR(64),
    region          VARCHAR(128),
    city            VARCHAR(128),
    ua              VARCHAR(512),
    device_type     VARCHAR(32),
    os_name         VARCHAR(64),
    os_version      VARCHAR(64),
    browser         VARCHAR(64),
    download_os     VARCHAR(64),
    download_arch   VARCHAR(32),
    download_file   VARCHAR(255),
    path            VARCHAR(512),
    referrer        VARCHAR(512),
    session_id      VARCHAR(64),
    product_id      BIGINT
);

CREATE INDEX IF NOT EXISTS idx_hub_events_ts ON hub_events (ts DESC);
CREATE INDEX IF NOT EXISTS idx_hub_events_type_ts ON hub_events (event_type, ts DESC);
CREATE INDEX IF NOT EXISTS idx_hub_events_session ON hub_events (session_id);
CREATE INDEX IF NOT EXISTS idx_hub_events_path_ts ON hub_events (path, ts DESC);
CREATE INDEX IF NOT EXISTS idx_hub_events_product ON hub_events (product_id, ts DESC);
