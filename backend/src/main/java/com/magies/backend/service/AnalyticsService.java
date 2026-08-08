package com.magies.backend.service;

import com.magies.backend.entity.HubEvent;
import com.magies.backend.repository.HubEventRepository;
import com.magies.backend.util.UaParser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Shanghai");
    private static final DateTimeFormatter DAY_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter HOUR_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:00");

    private final HubEventRepository hubEventRepository;
    private final EntityManager entityManager;

    public AnalyticsService(HubEventRepository hubEventRepository, EntityManager entityManager) {
        this.hubEventRepository = hubEventRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public void track(Map<String, Object> body, String ip, String headerUa) {
        String type = str(body.get("eventType"), "page_view");
        if (!"page_view".equals(type) && !"download".equals(type)) {
            type = "page_view";
        }
        String ua = firstNonBlank(str(body.get("ua"), null), headerUa);
        UaParser.DeviceInfo device = UaParser.parse(ua);

        HubEvent e = new HubEvent();
        e.setTs(Instant.now());
        e.setEventType(type);
        e.setIp(maskIp(ip));
        e.setUa(trim(ua, 512));
        e.setDeviceType(device.deviceType());
        e.setOsName(device.osName());
        e.setOsVersion(device.osVersion());
        e.setBrowser(device.browser());
        e.setPath(trim(str(body.get("path"), null), 512));
        e.setReferrer(trim(str(body.get("referrer"), null), 512));
        e.setSessionId(trim(str(body.get("sessionId"), null), 64));
        e.setDownloadFile(trim(str(body.get("downloadFile"), null), 255));
        e.setDownloadOs(trim(str(body.get("downloadOs"), null), 64));
        e.setDownloadArch(trim(str(body.get("downloadArch"), null), 32));
        if (body.get("productId") != null) {
            try {
                e.setProductId(Long.valueOf(body.get("productId").toString()));
            } catch (NumberFormatException ignored) {
                // skip
            }
        }
        // Geo DB not bundled — leave null; UI shows Unknown when empty.
        hubEventRepository.save(e);
    }

    @Transactional
    public void trackDownload(Long productId, String productName, String ip, String ua, String sessionId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("eventType", "download");
        body.put("path", "/download");
        body.put("downloadFile", productName != null ? productName : "unknown");
        body.put("productId", productId);
        body.put("sessionId", sessionId);
        body.put("ua", ua);
        track(body, ip, ua);
    }

    public Map<String, Object> dashboard(int days) {
        int range = clampDays(days);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("generatedAt", Instant.now().toString());
        result.put("rangeDays", range);
        result.put("overview", overview());
        result.put("conversion", conversion(range));
        result.put("timeseries", Map.of(
                "visitDay", timeseries("page_view", "day", range),
                "downloadDay", timeseries("download", "day", range),
                "visitMonth", timeseries("page_view", "month", 365),
                "downloadMonth", timeseries("download", "month", 365)
        ));
        result.put("hourly", hourly());
        result.put("hourOfDay", hourOfDay(range));
        result.put("geo", Map.of(
                "visit", geo("page_view", range),
                "download", geo("download", range)
        ));
        result.put("devices", devices(range));
        result.put("breakdown", downloadBreakdown(range));
        result.put("downloadFiles", namedCounts(
                """
                SELECT COALESCE(NULLIF(download_file, ''), 'unknown') AS name, COUNT(*) AS cnt
                FROM hub_events
                WHERE event_type = 'download' AND ts >= :since
                GROUP BY 1 ORDER BY cnt DESC LIMIT 20
                """,
                Instant.now().minus(range, ChronoUnit.DAYS)
        ));
        result.put("referrers", namedCounts(
                """
                SELECT CASE
                    WHEN referrer IS NULL OR trim(referrer) = '' THEN '(direct)'
                    ELSE left(referrer, 120)
                END AS name, COUNT(*) AS cnt
                FROM hub_events
                WHERE event_type = 'page_view' AND ts >= :since
                GROUP BY 1 ORDER BY cnt DESC LIMIT 15
                """,
                Instant.now().minus(range, ChronoUnit.DAYS)
        ));
        result.put("paths", namedCounts(
                """
                SELECT COALESCE(NULLIF(path, ''), '/') AS name, COUNT(*) AS cnt
                FROM hub_events
                WHERE event_type = 'page_view' AND ts >= :since
                GROUP BY 1 ORDER BY cnt DESC LIMIT 15
                """,
                Instant.now().minus(range, ChronoUnit.DAYS)
        ));
        result.put("recent", recent(50, "all"));
        return result;
    }

    public List<Map<String, Object>> recent(int limit, String eventType) {
        int safe = Math.min(Math.max(limit, 1), 200);
        String sql = """
            SELECT ts, event_type, ip, country, region, city, device_type, os_name, browser,
                   download_os, download_arch, download_file, path, session_id
            FROM hub_events
            """;
        if ("page_view".equals(eventType) || "download".equals(eventType)) {
            sql += " WHERE event_type = :type";
        }
        sql += " ORDER BY ts DESC LIMIT " + safe;

        Query q = entityManager.createNativeQuery(sql);
        if ("page_view".equals(eventType) || "download".equals(eventType)) {
            q.setParameter("type", eventType);
        }
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("ts", toIso(r[0]));
            m.put("eventType", r[1]);
            m.put("ip", r[2]);
            m.put("country", r[3]);
            m.put("region", r[4]);
            m.put("city", r[5]);
            m.put("deviceType", r[6]);
            m.put("osName", r[7]);
            m.put("browser", r[8]);
            m.put("downloadOs", r[9]);
            m.put("downloadArch", r[10]);
            m.put("downloadFile", r[11]);
            m.put("path", r[12]);
            m.put("sessionId", r[13]);
            out.add(m);
        }
        return out;
    }

    private Map<String, Object> overview() {
        ZonedDateTime now = ZonedDateTime.now(ZONE);
        ZonedDateTime today = now.toLocalDate().atStartOfDay(ZONE);
        ZonedDateTime tomorrow = today.plusDays(1);
        ZonedDateTime yesterday = today.minusDays(1);
        ZonedDateTime dayLy = today.minusYears(1);
        ZonedDateTime dayLyEnd = dayLy.plusDays(1);
        ZonedDateTime monthStart = today.withDayOfMonth(1);
        ZonedDateTime nextMonth = monthStart.plusMonths(1);
        ZonedDateTime prevMonth = monthStart.minusMonths(1);
        ZonedDateTime monthLy = monthStart.minusYears(1);
        ZonedDateTime monthLyEnd = monthLy.plusMonths(1);

        long vToday = count("page_view", today.toInstant(), tomorrow.toInstant());
        long dToday = count("download", today.toInstant(), tomorrow.toInstant());
        long vYest = count("page_view", yesterday.toInstant(), today.toInstant());
        long dYest = count("download", yesterday.toInstant(), today.toInstant());
        long vTodayLy = count("page_view", dayLy.toInstant(), dayLyEnd.toInstant());
        long dTodayLy = count("download", dayLy.toInstant(), dayLyEnd.toInstant());
        long vMonth = count("page_view", monthStart.toInstant(), nextMonth.toInstant());
        long dMonth = count("download", monthStart.toInstant(), nextMonth.toInstant());
        long vPrev = count("page_view", prevMonth.toInstant(), monthStart.toInstant());
        long dPrev = count("download", prevMonth.toInstant(), monthStart.toInstant());
        long vMonthLy = count("page_view", monthLy.toInstant(), monthLyEnd.toInstant());
        long dMonthLy = count("download", monthLy.toInstant(), monthLyEnd.toInstant());
        long vTotal = countAll("page_view");
        long dTotal = countAll("download");

        return Map.of(
                "visits", metricBlock(vToday, vMonth, vTotal, pct(vToday, vYest), pct(vToday, vTodayLy), pct(vMonth, vPrev), pct(vMonth, vMonthLy)),
                "downloads", metricBlock(dToday, dMonth, dTotal, pct(dToday, dYest), pct(dToday, dTodayLy), pct(dMonth, dPrev), pct(dMonth, dMonthLy))
        );
    }

    private Map<String, Object> conversion(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        long visits = countSince("page_view", since);
        long downloads = countSince("download", since);
        long sessionsV = distinctSessions("page_view", since);
        long sessionsD = distinctSessions("download", since);
        Double eventRate = visits == 0 ? null : round2(downloads * 100.0 / visits);
        Double sessionRate = sessionsV == 0 ? null : round2(sessionsD * 100.0 / sessionsV);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("days", days);
        m.put("visits", visits);
        m.put("downloads", downloads);
        m.put("eventRate", eventRate);
        m.put("sessionsVisited", sessionsV);
        m.put("sessionsDownloaded", sessionsD);
        m.put("sessionRate", sessionRate);
        return m;
    }

    private List<Map<String, Object>> timeseries(String eventType, String grain, int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        String trunc = "day".equals(grain) ? "day" : "month";
        String fmt = "day".equals(grain) ? "YYYY-MM-DD" : "YYYY-MM";
        String sql = """
            SELECT to_char(date_trunc('%s', ts AT TIME ZONE 'Asia/Shanghai'), '%s') AS bucket, COUNT(*) AS cnt
            FROM hub_events
            WHERE event_type = :type AND ts >= :since
            GROUP BY 1 ORDER BY 1
            """.formatted(trunc, fmt);
        Map<String, Long> map = new LinkedHashMap<>();
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("type", eventType);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        for (Object[] r : rows) {
            map.put(String.valueOf(r[0]), ((Number) r[1]).longValue());
        }
        return fillBuckets(map, grain, days);
    }

    private List<Map<String, Object>> fillBuckets(Map<String, Long> map, String grain, int days) {
        List<Map<String, Object>> out = new ArrayList<>();
        ZonedDateTime end = ZonedDateTime.now(ZONE);
        if ("day".equals(grain)) {
            LocalDate d = end.toLocalDate().minusDays(days - 1L);
            LocalDate last = end.toLocalDate();
            while (!d.isAfter(last)) {
                String b = d.format(DAY_FMT);
                out.add(Map.of("bucket", b, "count", map.getOrDefault(b, 0L)));
                d = d.plusDays(1);
            }
        } else {
            ZonedDateTime m = end.withDayOfMonth(1).minusMonths(11);
            for (int i = 0; i < 12; i++) {
                String b = m.format(MONTH_FMT);
                out.add(Map.of("bucket", b, "count", map.getOrDefault(b, 0L)));
                m = m.plusMonths(1);
            }
        }
        return out;
    }

    private List<Map<String, Object>> hourly() {
        Instant since = Instant.now().minus(24, ChronoUnit.HOURS);
        Map<String, Long> visits = bucketMap("""
            SELECT to_char(date_trunc('hour', ts AT TIME ZONE 'Asia/Shanghai'), 'YYYY-MM-DD HH24:00') AS bucket, COUNT(*) AS cnt
            FROM hub_events WHERE event_type = 'page_view' AND ts >= :since GROUP BY 1
            """, since);
        Map<String, Long> downloads = bucketMap("""
            SELECT to_char(date_trunc('hour', ts AT TIME ZONE 'Asia/Shanghai'), 'YYYY-MM-DD HH24:00') AS bucket, COUNT(*) AS cnt
            FROM hub_events WHERE event_type = 'download' AND ts >= :since GROUP BY 1
            """, since);

        List<Map<String, Object>> out = new ArrayList<>();
        ZonedDateTime end = ZonedDateTime.now(ZONE).truncatedTo(ChronoUnit.HOURS);
        for (int i = 23; i >= 0; i--) {
            String b = end.minusHours(i).format(HOUR_FMT);
            out.add(Map.of(
                    "bucket", b,
                    "visits", visits.getOrDefault(b, 0L),
                    "downloads", downloads.getOrDefault(b, 0L)
            ));
        }
        return out;
    }

    private List<Map<String, Object>> hourOfDay(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        String sql = """
            SELECT EXTRACT(HOUR FROM ts AT TIME ZONE 'Asia/Shanghai')::int AS hour,
                   event_type, COUNT(*) AS cnt
            FROM hub_events WHERE ts >= :since
            GROUP BY 1, 2
            """;
        long[] v = new long[24];
        long[] d = new long[24];
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        for (Object[] r : rows) {
            int hour = ((Number) r[0]).intValue();
            long cnt = ((Number) r[2]).longValue();
            if ("page_view".equals(String.valueOf(r[1]))) v[hour] = cnt;
            else if ("download".equals(String.valueOf(r[1]))) d[hour] = cnt;
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            out.add(Map.of("hour", h, "visits", v[h], "downloads", d[h]));
        }
        return out;
    }

    private List<Map<String, Object>> geo(String eventType, int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        String sql = """
            SELECT COALESCE(country, 'Unknown') AS country,
                   COALESCE(region, '-') AS region,
                   COALESCE(city, '-') AS city,
                   COUNT(*) AS cnt
            FROM hub_events
            WHERE event_type = :type AND ts >= :since
            GROUP BY 1, 2, 3 ORDER BY cnt DESC LIMIT 20
            """;
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("type", eventType);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            out.add(Map.of(
                    "country", String.valueOf(r[0]),
                    "region", String.valueOf(r[1]),
                    "city", String.valueOf(r[2]),
                    "count", ((Number) r[3]).longValue()
            ));
        }
        return out;
    }

    private Map<String, Object> devices(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        return Map.of(
                "device", namedCounts("""
                    SELECT CASE
                      WHEN device_type IN ('phone', 'mobile') THEN 'phone'
                      WHEN device_type = 'tablet' THEN 'tablet'
                      WHEN device_type IN ('pc', 'desktop') OR device_type LIKE 'desktop/%' THEN 'pc'
                      ELSE 'unknown'
                    END AS name, COUNT(*) AS cnt
                    FROM hub_events
                    WHERE event_type = 'page_view' AND ts >= :since
                    GROUP BY 1 ORDER BY cnt DESC
                    """, since),
                "pcOs", namedCounts("""
                    SELECT COALESCE(os_name, 'Unknown') AS name, COUNT(*) AS cnt
                    FROM hub_events
                    WHERE event_type = 'page_view' AND ts >= :since
                      AND COALESCE(os_name, '') NOT IN ('iOS', 'iPadOS', 'Android')
                    GROUP BY 1 ORDER BY cnt DESC LIMIT 12
                    """, since),
                "browser", namedCounts("""
                    SELECT COALESCE(browser, 'Unknown') AS name, COUNT(*) AS cnt
                    FROM hub_events
                    WHERE event_type = 'page_view' AND ts >= :since
                    GROUP BY 1 ORDER BY cnt DESC LIMIT 12
                    """, since),
                "os", namedCounts("""
                    SELECT COALESCE(os_name, 'Unknown') AS name, COUNT(*) AS cnt
                    FROM hub_events
                    WHERE event_type = 'page_view' AND ts >= :since
                    GROUP BY 1 ORDER BY cnt DESC LIMIT 12
                    """, since)
        );
    }

    private List<Map<String, Object>> downloadBreakdown(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        String sql = """
            SELECT COALESCE(download_os, 'unknown') AS os,
                   COALESCE(download_arch, 'unknown') AS arch,
                   COUNT(*) AS cnt
            FROM hub_events
            WHERE event_type = 'download' AND ts >= :since
            GROUP BY 1, 2 ORDER BY cnt DESC
            """;
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            out.add(Map.of(
                    "os", String.valueOf(r[0]),
                    "arch", String.valueOf(r[1]),
                    "count", ((Number) r[2]).longValue()
            ));
        }
        return out;
    }

    private List<Map<String, Object>> namedCounts(String sql, Instant since) {
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            out.add(Map.of("name", String.valueOf(r[0]), "count", ((Number) r[1]).longValue()));
        }
        return out;
    }

    private Map<String, Long> bucketMap(String sql, Instant since) {
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("since", since);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] r : rows) {
            map.put(String.valueOf(r[0]), ((Number) r[1]).longValue());
        }
        return map;
    }

    private long count(String type, Instant from, Instant to) {
        Query q = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM hub_events WHERE event_type = :type AND ts >= :from AND ts < :to"
        );
        q.setParameter("type", type);
        q.setParameter("from", from);
        q.setParameter("to", to);
        return ((Number) q.getSingleResult()).longValue();
    }

    private long countAll(String type) {
        Query q = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM hub_events WHERE event_type = :type"
        );
        q.setParameter("type", type);
        return ((Number) q.getSingleResult()).longValue();
    }

    private long countSince(String type, Instant since) {
        Query q = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM hub_events WHERE event_type = :type AND ts >= :since"
        );
        q.setParameter("type", type);
        q.setParameter("since", since);
        return ((Number) q.getSingleResult()).longValue();
    }

    private long distinctSessions(String type, Instant since) {
        Query q = entityManager.createNativeQuery(
                """
                SELECT COUNT(DISTINCT session_id) FROM hub_events
                WHERE event_type = :type AND ts >= :since
                  AND session_id IS NOT NULL AND session_id <> ''
                """
        );
        q.setParameter("type", type);
        q.setParameter("since", since);
        return ((Number) q.getSingleResult()).longValue();
    }

    private static Map<String, Object> metricBlock(
            long today, long month, long total,
            Double dod, Double yoyDay, Double mom, Double yoyMonth
    ) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("today", today);
        m.put("month", month);
        m.put("total", total);
        m.put("dod", dod);
        m.put("yoyDay", yoyDay);
        m.put("mom", mom);
        m.put("yoyMonth", yoyMonth);
        return m;
    }

    private static Double pct(long current, long previous) {
        if (previous == 0) return current == 0 ? 0.0 : null;
        return round1((current - previous) * 100.0 / previous);
    }

    private static Double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private static Double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private static int clampDays(int days) {
        if (days <= 7) return 7;
        if (days <= 30) return 30;
        return 90;
    }

    private static String str(Object v, String fallback) {
        if (v == null) return fallback;
        String s = String.valueOf(v).trim();
        return s.isEmpty() ? fallback : s;
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) return a;
        return b;
    }

    private static String trim(String s, int max) {
        if (s == null) return null;
        String t = s.trim();
        if (t.isEmpty()) return null;
        return t.length() <= max ? t : t.substring(0, max);
    }

    /** Mask last octet of IPv4 / last group of IPv6 for privacy on the board. */
    static String maskIp(String ip) {
        if (ip == null || ip.isBlank()) return null;
        String first = ip.split(",")[0].trim();
        if (first.contains(".")) {
            int last = first.lastIndexOf('.');
            if (last > 0) return first.substring(0, last) + ".0";
        }
        if (first.contains(":")) {
            int last = first.lastIndexOf(':');
            if (last > 0) return first.substring(0, last) + ":0";
        }
        return first;
    }

    private static String toIso(Object ts) {
        if (ts == null) return null;
        if (ts instanceof Instant i) return i.toString();
        if (ts instanceof java.sql.Timestamp t) return t.toInstant().toString();
        return String.valueOf(ts);
    }
}
