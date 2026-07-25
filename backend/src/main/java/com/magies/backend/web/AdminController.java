package com.magies.backend.web;

import com.magies.backend.entity.Feedback;
import com.magies.backend.entity.MailLog;
import com.magies.backend.entity.Product;
import com.magies.backend.entity.ProductCategory;
import com.magies.backend.entity.SysUser;
import com.magies.backend.repository.FeedbackRepository;
import com.magies.backend.repository.MailLogRepository;
import com.magies.backend.repository.ProductCategoryRepository;
import com.magies.backend.repository.ProductRepository;
import com.magies.backend.repository.SysUserRepository;
import com.magies.backend.service.StatsService;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StatsService statsService;
    private final SysUserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final MailLogRepository mailLogRepository;
    private final FeedbackRepository feedbackRepository;

    public AdminController(
            StatsService statsService,
            SysUserRepository userRepository,
            ProductRepository productRepository,
            ProductCategoryRepository categoryRepository,
            MailLogRepository mailLogRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.statsService = statsService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.mailLogRepository = mailLogRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("stats", statsService.dashboard());
        result.put("recentUsers", userRepository.findAll().stream().limit(20).toList());
        result.put("products", productRepository.findAll());
        result.put("mailLogs", mailLogRepository.findTop50ByOrderByCreatedAtDesc());
        result.put("feedback", feedbackRepository.findTop30ByOrderByCreatedAtDesc());
        return result;
    }

    @GetMapping("/users")
    public List<SysUser> users() {
        return userRepository.findAll();
    }

    @GetMapping("/products")
    public List<Product> products() {
        return productRepository.findAll();
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Map<String, Object> body) {
        Product p = new Product();
        apply(p, body, true);
        p.setCreatedAt(Instant.now());
        p.setUpdatedAt(Instant.now());
        return productRepository.save(p);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("工具不存在"));
        apply(p, body, false);
        p.setUpdatedAt(Instant.now());
        return productRepository.save(p);
    }

    @DeleteMapping("/products/{id}")
    public Map<String, Object> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("工具不存在");
        }
        productRepository.deleteById(id);
        return Map.of("success", true);
    }

    @GetMapping("/categories")
    public List<ProductCategory> categories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/categories")
    public ProductCategory createCategory(@RequestBody Map<String, Object> body) {
        ProductCategory c = new ProductCategory();
        applyCategory(c, body, true);
        return categoryRepository.save(c);
    }

    @PutMapping("/categories/{id}")
    public ProductCategory updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        ProductCategory c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("分类不存在"));
        applyCategory(c, body, false);
        return categoryRepository.save(c);
    }

    @DeleteMapping("/categories/{id}")
    public Map<String, Object> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("分类不存在");
        }
        // 不静默把产品变成孤儿——先要求把产品移走。
        long inUse = productRepository.findAll().stream()
                .filter(p -> id.equals(p.getCategoryId()))
                .count();
        if (inUse > 0) {
            throw new IllegalArgumentException("该分类下还有 " + inUse + " 个产品，请先移到其他分类");
        }
        categoryRepository.deleteById(id);
        return Map.of("success", true);
    }

    private void applyCategory(ProductCategory c, Map<String, Object> body, boolean creating) {
        String name = str(body.get("name"));
        String slug = str(body.get("slug"));

        if (creating) {
            if (name == null || name.isBlank()) throw new IllegalArgumentException("分类名称必填");
            c.setName(name.trim());
            c.setSlug(slugify(slug == null || slug.isBlank() ? name : slug));
        } else {
            if (name != null && !name.isBlank()) c.setName(name.trim());
            if (slug != null && !slug.isBlank()) c.setSlug(slugify(slug));
        }

        if (body.containsKey("sortOrder")) {
            Object s = body.get("sortOrder");
            c.setSortOrder(s == null || String.valueOf(s).isBlank() ? 0 : Integer.valueOf(String.valueOf(s)));
        } else if (creating) {
            c.setSortOrder(0);
        }
    }

    @GetMapping("/mail-logs")
    public List<MailLog> mailLogs() {
        return mailLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    @GetMapping("/feedback")
    public List<Feedback> feedback() {
        return feedbackRepository.findTop30ByOrderByCreatedAtDesc();
    }

    private void apply(Product p, Map<String, Object> body, boolean creating) {
        String name = str(body.get("name"));
        String slug = str(body.get("slug"));
        String homepageUrl = str(body.get("homepageUrl"));

        if (creating) {
            if (name == null || name.isBlank()) throw new IllegalArgumentException("名称必填");
            if (slug == null || slug.isBlank()) {
                slug = slugify(name);
            }
            if (productRepository.findBySlug(slug).isPresent()) {
                throw new IllegalArgumentException("slug 已存在：" + slug);
            }
            p.setName(name.trim());
            p.setSlug(slug.trim());
        } else {
            if (name != null && !name.isBlank()) p.setName(name.trim());
            if (slug != null && !slug.isBlank()) {
                String s = slug.trim();
                productRepository.findBySlug(s).ifPresent(other -> {
                    if (!other.getId().equals(p.getId())) {
                        throw new IllegalArgumentException("slug 已存在：" + s);
                    }
                });
                p.setSlug(s);
            }
        }

        if (body.containsKey("tagline")) p.setTagline(str(body.get("tagline")));
        if (body.containsKey("description")) p.setDescription(str(body.get("description")));
        if (body.containsKey("icon")) p.setIcon(str(body.get("icon")));
        if (body.containsKey("accentColor")) p.setAccentColor(str(body.get("accentColor")));
        if (body.containsKey("homepageUrl")) p.setHomepageUrl(homepageUrl);
        if (body.containsKey("status")) {
            String status = str(body.get("status"));
            p.setStatus(status == null || status.isBlank() ? "PUBLISHED" : status.trim().toUpperCase());
        } else if (creating) {
            p.setStatus("PUBLISHED");
        }
        if (body.containsKey("categoryId")) {
            Object c = body.get("categoryId");
            p.setCategoryId(c == null || String.valueOf(c).isBlank() ? 1L : Long.valueOf(String.valueOf(c)));
        } else if (creating) {
            p.setCategoryId(1L);
        }
        if (body.containsKey("sortOrder")) {
            Object s = body.get("sortOrder");
            p.setSortOrder(s == null || String.valueOf(s).isBlank() ? 0 : Integer.valueOf(String.valueOf(s)));
        } else if (creating) {
            p.setSortOrder(0);
        }

        if (creating && (p.getIcon() == null || p.getIcon().isBlank())) {
            p.setIcon("layout-grid");
        }
        if (creating && (p.getAccentColor() == null || p.getAccentColor().isBlank())) {
            p.setAccentColor("#6ea8f0");
        }
    }

    private static String str(Object v) {
        return v == null ? null : String.valueOf(v);
    }

    private static String slugify(String name) {
        String s = name.trim().toLowerCase()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("^-|-$", "");
        if (s.isBlank()) s = "tool-" + System.currentTimeMillis();
        return s;
    }
}
