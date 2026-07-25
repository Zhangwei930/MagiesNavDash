package com.magies.backend.web;

import com.magies.backend.entity.Feedback;
import com.magies.backend.entity.MailLog;
import com.magies.backend.entity.Product;
import com.magies.backend.entity.SysUser;
import com.magies.backend.repository.FeedbackRepository;
import com.magies.backend.repository.MailLogRepository;
import com.magies.backend.repository.ProductRepository;
import com.magies.backend.repository.SysUserRepository;
import com.magies.backend.service.StatsService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StatsService statsService;
    private final SysUserRepository userRepository;
    private final ProductRepository productRepository;
    private final MailLogRepository mailLogRepository;
    private final FeedbackRepository feedbackRepository;

    public AdminController(
            StatsService statsService,
            SysUserRepository userRepository,
            ProductRepository productRepository,
            MailLogRepository mailLogRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.statsService = statsService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
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

    @GetMapping("/mail-logs")
    public List<MailLog> mailLogs() {
        return mailLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    @GetMapping("/feedback")
    public List<Feedback> feedback() {
        return feedbackRepository.findTop30ByOrderByCreatedAtDesc();
    }
}
