package com.magies.backend.web;

import com.magies.backend.entity.Product;
import com.magies.backend.entity.ProductCategory;
import com.magies.backend.entity.ProductRelease;
import com.magies.backend.repository.ProductCategoryRepository;
import com.magies.backend.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final ProductCategoryRepository categoryRepository;

    public ProductController(ProductService productService, ProductCategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/products")
    public List<Product> list() {
        return productService.listPublished();
    }

    @GetMapping("/categories")
    public List<ProductCategory> categories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/products/{slug}")
    public Map<String, Object> detail(@PathVariable String slug) {
        return productService.getDetail(slug);
    }

    @GetMapping("/releases/latest")
    public List<ProductRelease> latestReleases() {
        return productService.listLatestReleases();
    }

    @PostMapping("/downloads")
    public Map<String, Object> download(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Long productId = body.get("productId") == null ? null : Long.valueOf(body.get("productId").toString());
        Long releaseId = body.get("releaseId") == null ? null : Long.valueOf(body.get("releaseId").toString());
        if (productId == null) {
            throw new IllegalArgumentException("productId 必填");
        }
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        String sessionId = body.get("sessionId") == null ? null : String.valueOf(body.get("sessionId"));
        return productService.recordDownload(productId, releaseId, ip, request.getHeader("User-Agent"), sessionId);
    }
}
