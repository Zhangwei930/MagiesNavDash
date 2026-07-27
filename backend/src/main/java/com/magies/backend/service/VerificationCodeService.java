package com.magies.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {

    private static final Logger log = LoggerFactory.getLogger(VerificationCodeService.class);
    private static final Duration TTL = Duration.ofMinutes(5);
    private static final Duration MIN_INTERVAL = Duration.ofMinutes(1);

    private final SecureRandom random = new SecureRandom();
    private final Map<String, CodeEntry> memory = new ConcurrentHashMap<>();

    @Autowired(required = false)
    private StringRedisTemplate redis;

    public String generateAndStore(String email) {
        String key = codeKey(email);
        String rateKey = rateKey(email);

        if (isRateLimited(rateKey)) {
            throw new IllegalStateException("发送过于频繁，请 1 分钟后再试");
        }

        String code = String.format("%06d", random.nextInt(1_000_000));
        put(key, code, TTL);
        put(rateKey, "1", MIN_INTERVAL);
        return code;
    }

    public boolean verify(String email, String code) {
        String key = codeKey(email);
        String stored = get(key);
        if (stored != null && stored.equals(code)) {
            delete(key);
            return true;
        }
        return false;
    }

    private boolean isRateLimited(String rateKey) {
        return get(rateKey) != null;
    }

    private void put(String key, String value, Duration ttl) {
        if (redis != null) {
            try {
                redis.opsForValue().set(key, value, ttl);
                return;
            } catch (Exception e) {
                log.warn("Redis unavailable, fallback to memory: {}", e.getMessage());
            }
        }
        memory.put(key, new CodeEntry(value, System.currentTimeMillis() + ttl.toMillis()));
    }

    private String get(String key) {
        if (redis != null) {
            try {
                return redis.opsForValue().get(key);
            } catch (Exception e) {
                log.warn("Redis get failed: {}", e.getMessage());
            }
        }
        CodeEntry entry = memory.get(key);
        if (entry == null) return null;
        if (entry.expireAt < System.currentTimeMillis()) {
            memory.remove(key);
            return null;
        }
        return entry.value;
    }

    private void delete(String key) {
        if (redis != null) {
            try {
                redis.delete(key);
            } catch (Exception ignored) {
            }
        }
        memory.remove(key);
    }

    private String codeKey(String email) {
        return "magies:code:" + email.toLowerCase();
    }

    private String rateKey(String email) {
        return "magies:rate:" + email.toLowerCase();
    }

    private record CodeEntry(String value, long expireAt) {}
}
