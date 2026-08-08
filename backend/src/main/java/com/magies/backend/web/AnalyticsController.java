package com.magies.backend.web;

import com.magies.backend.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /** Public beacon — page views & optional client-side download events. */
    @PostMapping("/api/stats/track")
    public Map<String, Object> track(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        analyticsService.track(body, clientIp(request), request.getHeader("User-Agent"));
        return Map.of("ok", true);
    }

    /** Admin analytics payload for the stats dashboard. */
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
