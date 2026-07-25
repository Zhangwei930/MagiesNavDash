package com.magies.backend.repository;

import com.magies.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatusOrderBySortOrderAsc(String status);

    List<Product> findByStatusNotInOrderBySortOrderAsc(Collection<String> statuses);

    Optional<Product> findBySlugAndStatus(String slug, String status);

    Optional<Product> findBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE p.slug = :slug AND p.status NOT IN :excluded")
    Optional<Product> findPublicBySlug(@Param("slug") String slug, @Param("excluded") Collection<String> excluded);
}
