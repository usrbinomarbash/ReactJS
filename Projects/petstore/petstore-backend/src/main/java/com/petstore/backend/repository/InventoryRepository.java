package com.petstore.backend.repository;

import com.petstore.backend.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query(value = "SELECT * FROM Inventory", nativeQuery = true)
    List<Inventory> findAllInventory();

    @Query(value = "SELECT * FROM Inventory WHERE product_id = :productId", nativeQuery = true)
    List<Inventory> findByProductId(Long productId);

    @Query(value = "SELECT * FROM Inventory WHERE in_date = :date", nativeQuery = true)
    List<Inventory> findByInDate(LocalDate date);

    List<Inventory> findByReason(String reason);

    List<Inventory> findByProductIdAndInDateBetween(Long productId, LocalDate startDate, LocalDate endDate);
}