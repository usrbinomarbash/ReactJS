package com.petstore.backend.repository;

import com.petstore.backend.model.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query(
        value="SELECT * FROM category ORDER BY name",
        nativeQuery = true
    )
    List<Category> findAllOrderByName();

    @Query(
        value="""
            SELECT c.name, COUNT(p.product_id) AS product_cnt
            FROM category c
            LEFT JOIN product p ON c.category_id=p.category_id
            GROUP BY c.category_id, c.name
            ORDER BY product_cnt DESC
    
            """, nativeQuery = true
    )
    List<Object[] > countProductsPerCategory();

    

    
}