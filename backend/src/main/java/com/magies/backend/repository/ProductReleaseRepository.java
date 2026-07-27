package com.magies.backend.repository;

import com.magies.backend.entity.ProductRelease;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductReleaseRepository extends JpaRepository<ProductRelease, Long> {
    List<ProductRelease> findByProductIdOrderByPublishedAtDesc(Long productId);
    Optional<ProductRelease> findFirstByProductIdAndIsLatestTrue(Long productId);
    List<ProductRelease> findByIsLatestTrueOrderByPublishedAtDesc();
}
