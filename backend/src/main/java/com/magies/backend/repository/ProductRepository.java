package com.magies.backend.repository;

import com.magies.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatusOrderBySortOrderAsc(String status);
    Optional<Product> findBySlugAndStatus(String slug, String status);
    Optional<Product> findBySlug(String slug);
}
