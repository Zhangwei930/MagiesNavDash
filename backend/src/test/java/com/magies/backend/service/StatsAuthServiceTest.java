package com.magies.backend.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StatsAuthServiceTest {

    @Test
    void safeEqualsIsTrueForSameStrings() {
        assertTrue(StatsAuthService.safeEquals("magies", "magies"));
        assertTrue(StatsAuthService.safeEquals("MagiesStats2026!", "MagiesStats2026!"));
    }

    @Test
    void safeEqualsIsFalseForMismatch() {
        assertFalse(StatsAuthService.safeEquals("magies", "other"));
        assertFalse(StatsAuthService.safeEquals("a", "aa"));
        assertFalse(StatsAuthService.safeEquals(null, "x"));
    }
}
