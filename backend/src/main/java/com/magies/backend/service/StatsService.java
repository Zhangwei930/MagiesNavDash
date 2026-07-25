package com.magies.backend.service;

import com.magies.backend.repository.MailLogRepository;
import com.magies.backend.repository.ProductDownloadLogRepository;
import com.magies.backend.repository.ProductRepository;
import com.magies.backend.repository.SysUserRepository;
import com.magies.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class StatsService {

    private final SysUserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductDownloadLogRepository downloadLogRepository;
    private final MailLogRepository mailLogRepository;
    private final FeedbackRepository feedbackRepository;

    public StatsService(
            SysUserRepository userRepository,
            ProductRepository productRepository,
            ProductDownloadLogRepository downloadLogRepository,
            MailLogRepository mailLogRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.downloadLogRepository = downloadLogRepository;
        this.mailLogRepository = mailLogRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public Map<String, Object> dashboard() {
        Instant dayAgo = Instant.now().minus(1, ChronoUnit.DAYS);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("users", userRepository.count());
        stats.put("products", productRepository.count());
        stats.put("downloadsTotal", downloadLogRepository.countAll());
        stats.put("downloadsToday", downloadLogRepository.countByCreatedAtAfter(dayAgo));
        stats.put("mailSent", mailLogRepository.countByStatus("SENT") + mailLogRepository.countByStatus("FALLBACK"));
        stats.put("feedbackOpen", feedbackRepository.countByStatus("OPEN"));
        return stats;
    }
}
