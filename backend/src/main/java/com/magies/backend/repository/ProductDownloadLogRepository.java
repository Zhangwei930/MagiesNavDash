package com.magies.backend.repository;

import com.magies.backend.entity.ProductDownloadLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.Instant;

public interface ProductDownloadLogRepository extends JpaRepository<ProductDownloadLog, Long> {
    long countByCreatedAtAfter(Instant after);

    @Query("select count(d) from ProductDownloadLog d")
    long countAll();
}
