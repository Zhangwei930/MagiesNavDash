package com.magies.backend.repository;

import com.magies.backend.entity.ProductFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductFeatureRepository extends JpaRepository<ProductFeature, Long> {
    List<ProductFeature> findByProductIdOrderBySortOrderAsc(Long productId);
}
