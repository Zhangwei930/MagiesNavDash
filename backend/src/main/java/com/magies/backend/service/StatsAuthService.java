package com.magies.backend.service;

import com.magies.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Fixed username/password gate for the /stats analytics board
 * (same idea as Magies Terminal shell.magies.top/stats).
 */
@Service
public class StatsAuthService {

    private final String username;
    private final String password;
    private final JwtService jwtService;

    public StatsAuthService(
            @Value("${magies.stats.username}") String username,
            @Value("${magies.stats.password}") String password,
            JwtService jwtService
    ) {
        this.username = username;
        this.password = password;
        this.jwtService = jwtService;
    }

    public Map<String, Object> login(String user, String pass) {
        if (!safeEquals(user, username) || !safeEquals(pass, password)) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        // Synthetic subject; role STATS unlocks /api/stats/* (not full admin).
        String token = jwtService.issueToken(0L, username, "STATS");
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("ok", true);
        out.put("token", token);
        out.put("username", username);
        return out;
    }

    /**
     * Constant-time string compare via SHA-256 digests so length and content
     * do not leak through short-circuit timing.
     */
    static boolean safeEquals(String a, String b) {
        if (a == null || b == null) return false;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] ha = md.digest(a.getBytes(StandardCharsets.UTF_8));
            byte[] hb = md.digest(b.getBytes(StandardCharsets.UTF_8));
            return MessageDigest.isEqual(ha, hb);
        } catch (NoSuchAlgorithmException e) {
            return a.equals(b);
        }
    }
}
