package com.magies.backend.util;

/**
 * Lightweight UA classification without third-party deps.
 * Good enough for device / OS / browser breakdown on the stats board.
 */
public final class UaParser {

    public record DeviceInfo(String deviceType, String osName, String osVersion, String browser) {}

    private UaParser() {}

    public static DeviceInfo parse(String ua) {
        if (ua == null || ua.isBlank() || ua.length() < 12) {
            return new DeviceInfo("unknown", null, null, null);
        }
        String raw = ua.toLowerCase();
        String deviceType = detectDevice(raw);
        String osName = detectOs(raw);
        String browser = detectBrowser(raw, ua);
        return new DeviceInfo(deviceType, osName, null, browser);
    }

    private static String detectDevice(String raw) {
        if (raw.contains("ipad") || raw.contains("tablet") || raw.contains("kindle") || raw.contains("silk")) {
            return "tablet";
        }
        if (raw.contains("mobi") || raw.contains("iphone") || raw.contains("ipod")
                || raw.contains("android") && raw.contains("mobile")
                || raw.contains("phone")) {
            return "phone";
        }
        if (raw.contains("android") && !raw.contains("mobile")) {
            return "tablet";
        }
        return "pc";
    }

    private static String detectOs(String raw) {
        if (raw.contains("ipad")) return "iPadOS";
        if (raw.contains("iphone") || raw.contains("ipod") || raw.contains("ios")) return "iOS";
        if (raw.contains("android")) return "Android";
        if (raw.contains("windows phone")) return "Windows";
        if (raw.contains("windows")) return "Windows";
        if (raw.contains("mac os x") || raw.contains("macintosh") || raw.contains("macos")) return "macOS";
        if (raw.contains("cros")) return "ChromeOS";
        if (raw.contains("linux") || raw.contains("ubuntu") || raw.contains("fedora") || raw.contains("debian")) {
            return "Linux";
        }
        if (raw.contains("harmony")) return "HarmonyOS";
        return null;
    }

    private static String detectBrowser(String raw, String original) {
        if (raw.contains("micromessenger") || raw.contains("wechat")) return "WeChat";
        if (raw.contains("edg/") || raw.contains("edgios") || raw.contains("edga")) return "Edge";
        if (raw.contains("opr/") || raw.contains("opera")) return "Opera";
        if (raw.contains("firefox") || raw.contains("fxios")) return "Firefox";
        if (raw.contains("crios") || (raw.contains("chrome") && !raw.contains("edg"))) return "Chrome";
        if (raw.contains("safari") && !raw.contains("chrome") && !raw.contains("chromium")) return "Safari";
        if (raw.contains("samsungbrowser")) return "Samsung Internet";
        if (raw.contains("ucbrowser") || raw.contains("ucbrowser")) return "UC Browser";
        if (raw.contains("qqbrowser") || original.contains("QQ/")) return "QQ Browser";
        if (raw.contains("baidu")) return "Baidu";
        return null;
    }
}
