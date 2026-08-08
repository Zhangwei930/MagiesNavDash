package com.magies.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "hub_events")
public class HubEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Instant ts = Instant.now();

    @Column(name = "event_type", nullable = false, length = 32)
    private String eventType;

    @Column(length = 64)
    private String ip;

    @Column(length = 64)
    private String country;

    @Column(length = 128)
    private String region;

    @Column(length = 128)
    private String city;

    @Column(length = 512)
    private String ua;

    @Column(name = "device_type", length = 32)
    private String deviceType;

    @Column(name = "os_name", length = 64)
    private String osName;

    @Column(name = "os_version", length = 64)
    private String osVersion;

    @Column(length = 64)
    private String browser;

    @Column(name = "download_os", length = 64)
    private String downloadOs;

    @Column(name = "download_arch", length = 32)
    private String downloadArch;

    @Column(name = "download_file", length = 255)
    private String downloadFile;

    @Column(length = 512)
    private String path;

    @Column(length = 512)
    private String referrer;

    @Column(name = "session_id", length = 64)
    private String sessionId;

    @Column(name = "product_id")
    private Long productId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Instant getTs() { return ts; }
    public void setTs(Instant ts) { this.ts = ts; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getUa() { return ua; }
    public void setUa(String ua) { this.ua = ua; }
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    public String getOsName() { return osName; }
    public void setOsName(String osName) { this.osName = osName; }
    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    public String getDownloadOs() { return downloadOs; }
    public void setDownloadOs(String downloadOs) { this.downloadOs = downloadOs; }
    public String getDownloadArch() { return downloadArch; }
    public void setDownloadArch(String downloadArch) { this.downloadArch = downloadArch; }
    public String getDownloadFile() { return downloadFile; }
    public void setDownloadFile(String downloadFile) { this.downloadFile = downloadFile; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
