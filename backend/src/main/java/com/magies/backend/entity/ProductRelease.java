package com.magies.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "product_release")
public class ProductRelease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String version;

    private String channel = "stable";

    @Column(columnDefinition = "TEXT")
    private String changelog;

    private String downloadUrl;
    private String signature;
    private Long fileSize = 0L;
    private String platform = "universal";
    private Instant publishedAt = Instant.now();
    private Boolean isLatest = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getChangelog() { return changelog; }
    public void setChangelog(String changelog) { this.changelog = changelog; }
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }
    public Boolean getIsLatest() { return isLatest; }
    public void setIsLatest(Boolean isLatest) { this.isLatest = isLatest; }
}
