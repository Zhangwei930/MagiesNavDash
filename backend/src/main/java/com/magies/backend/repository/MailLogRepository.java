package com.magies.backend.repository;

import com.magies.backend.entity.MailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MailLogRepository extends JpaRepository<MailLog, Long> {
    List<MailLog> findTop50ByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
