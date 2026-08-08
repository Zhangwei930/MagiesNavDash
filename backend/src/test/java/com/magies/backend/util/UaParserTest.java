package com.magies.backend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UaParserTest {

    @Test
    void detectsDesktopChromeMac() {
        var info = UaParser.parse(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        );
        assertEquals("pc", info.deviceType());
        assertEquals("macOS", info.osName());
        assertEquals("Chrome", info.browser());
    }

    @Test
    void detectsIphoneSafari() {
        var info = UaParser.parse(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        );
        assertEquals("phone", info.deviceType());
        assertEquals("iOS", info.osName());
        assertEquals("Safari", info.browser());
    }

    @Test
    void weakUaIsUnknown() {
        var info = UaParser.parse("curl");
        assertEquals("unknown", info.deviceType());
    }
}
