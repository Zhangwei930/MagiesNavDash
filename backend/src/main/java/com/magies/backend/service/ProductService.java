package com.magies.backend.service;

import com.magies.backend.entity.Product;
import com.magies.backend.entity.ProductDownloadLog;
import com.magies.backend.entity.ProductFeature;
import com.magies.backend.entity.ProductRelease;
import com.magies.backend.repository.ProductDownloadLogRepository;
import com.magies.backend.repository.ProductFeatureRepository;
import com.magies.backend.repository.ProductReleaseRepository;
import com.magies.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductFeatureRepository featureRepository;
    private final ProductReleaseRepository releaseRepository;
    private final ProductDownloadLogRepository downloadLogRepository;
    private final AnalyticsService analyticsService;

    public ProductService(
            ProductRepository productRepository,
            ProductFeatureRepository featureRepository,
            ProductReleaseRepository releaseRepository,
            ProductDownloadLogRepository downloadLogRepository,
            AnalyticsService analyticsService
    ) {
        this.productRepository = productRepository;
        this.featureRepository = featureRepository;
        this.releaseRepository = releaseRepository;
        this.downloadLogRepository = downloadLogRepository;
        this.analyticsService = analyticsService;
    }

    /** Statuses hidden from the public catalog and product pages. */
    private static final List<String> HIDDEN_STATUSES = List.of("HIDDEN", "DISCONTINUED");

    public List<Product> listPublished() {
        return productRepository.findByStatusNotInOrderBySortOrderAsc(HIDDEN_STATUSES);
    }

    public Map<String, Object> getDetail(String slug) {
        Product product = productRepository.findPublicBySlug(slug, HIDDEN_STATUSES)
                .orElseThrow(() -> new IllegalArgumentException("产品不存在"));
        List<ProductFeature> features = featureRepository.findByProductIdOrderBySortOrderAsc(product.getId());
        List<ProductRelease> releases = releaseRepository.findByProductIdOrderByPublishedAtDesc(product.getId());
        ProductRelease latest = releaseRepository.findFirstByProductIdAndIsLatestTrue(product.getId()).orElse(null);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("product", product);
        result.put("features", features);
        result.put("releases", releases);
        result.put("latestRelease", latest);
        return result;
    }

    public List<ProductRelease> listLatestReleases() {
        return releaseRepository.findByIsLatestTrueOrderByPublishedAtDesc();
    }

    @Transactional
    public Map<String, Object> recordDownload(Long productId, Long releaseId, String ip, String ua, String sessionId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("产品不存在"));
        ProductRelease release = releaseId != null
                ? releaseRepository.findById(releaseId).orElse(null)
                : releaseRepository.findFirstByProductIdAndIsLatestTrue(productId).orElse(null);

        ProductDownloadLog log = new ProductDownloadLog();
        log.setProductId(product.getId());
        log.setReleaseId(release != null ? release.getId() : null);
        log.setIp(ip);
        log.setUserAgent(ua);
        downloadLogRepository.save(log);

        // Also feed the hub stats board (page_view / download analytics).
        analyticsService.trackDownload(product.getId(), product.getName(), ip, ua, sessionId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("product", product.getName());
        result.put("version", release != null ? release.getVersion() : null);
        result.put("downloadUrl", release != null ? release.getDownloadUrl() : null);
        result.put("signature", release != null ? release.getSignature() : null);
        result.put("message", "下载记录已写入，签名校验已启用");
        return result;
    }
}
