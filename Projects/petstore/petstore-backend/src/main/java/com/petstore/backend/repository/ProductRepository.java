package com.petstore.backend.repository;

import com.petstore.backend.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

        @Query(value = "SELECT * FROM product WHERE category_id = :categoryId", nativeQuery = true)
        List<Product> findByCategoryId(Long categoryId);

        @Query(value = "SELECT * FROM product WHERE vendor_id = :vendorId", nativeQuery = true)
        List<Product> findByVendor(Long vendorId);

        @Query(value = """
            SELECT p.product_id, p.name, p.price, p.stock_quantity,
            c.name AS category_name,
            v.name AS vendor_name
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN vendor v ON p.vendor_id = v.vendor_id
            ORDER BY p.name
            """, nativeQuery = true)
        List<Object[]> findProductCatalog();

        @Query(value = """
            SELECT * FROM product
            WHERE stock_quantity < :threshold
            ORDER BY stock_quantity ASC
            """, nativeQuery = true)
        List<Product> findLowStockProducts(int threshold);

        @Query(value = """
            SELECT p.product_id, p.name,
            SUM(oi.quantity) AS total_quantity
            FROM product p
            INNER JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY p.product_id, p.name
            ORDER BY total_quantity DESC
            LIMIT :limit
            """, nativeQuery = true)
        List<Object[]> findTopSellingProducts(int limit);

        List<Product> findByNameContainingIgnoreCase(String name);
        List<Product> findByCategoryContainingIgnoreCase(String category);

    
        @Query(value = """
        SELECT * FROM product
        WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:category IS NULL OR category = :category)
        AND (:minPrice IS NULL OR price >= :minPrice)
        AND (:maxPrice IS NULL OR price <= :maxPrice)
        ORDER BY name
        """, nativeQuery = true)
        List<Product> searchProducts(
        @Param("name") String name,
        @Param("category") String category,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice
        );
}