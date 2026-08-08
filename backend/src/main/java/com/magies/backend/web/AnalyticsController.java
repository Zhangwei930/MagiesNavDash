package com.magies.backend.web;

import com.magies.backend.service.AnalyticsService;
import com.magies.backend.service.StatsAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final StatsAuthService statsAuthService;

    public AnalyticsController(AnalyticsService analyticsService, StatsAuthService statsAuthService) {
        this.analyticsService = analyticsService;
        this.statsAuthService = statsAuthService;
    }

    /** Public beacon — page views & optional client-side download events. */
    @PostMapping("/api/stats/track")
    public Map<String, Object> track(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        analyticsService.track(body, clientIp(request), request.getHeader("User-Agent"));
        return Map.of("ok", true);
    }

    /** Username / password login for the stats board. */
    @PostMapping("/api/stats/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> body) {
        String username = body.get("username") == null ? "" : String.valueOf(body.get("username")).trim();
        String password = body.get("password") == null ? "" : String.valueOf(body.get("password"));
        return statsAuthService.login(username, password);
    }

    /** Stats dashboard payload (role STATS or ADMIN). */
    @GetMapping("/api/stats/dashboard")
    public Map<String, Object> statsDashboard(@RequestParam(defaultValue = "30") int days) {
        return analyticsService.dashboard(days);
    }

    @GetMapping("/api/stats/recent")
    public List<Map<String, Object>> statsRecent(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "all") String eventType
    ) {
        return analyticsService.recent(limit, eventType);
    }

    /** Legacy admin path — same payload, ADMIN only via security. */
    @GetMapping("/api/admin/analytics")
    public Map<String, Object> dashboard(@RequestParam(defaultValue = "30") int days) {
        return analyticsService.dashboard(days);
    }

    @GetMapping("/api/admin/analytics/recent")
    public List<Map<String, Object>> recent(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "all") String eventType
    ) {
        return analyticsService.recent(limit, eventType);
    }

    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) return realIp.trim();
        return request.getRemoteAddr();
    }
}
