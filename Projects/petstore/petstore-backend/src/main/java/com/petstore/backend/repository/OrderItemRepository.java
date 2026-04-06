package com.petstore.backend.repository;

import com.petstore.backend.model.OrderItem;
import com.petstore.backend.model.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {

    List<OrderItem> findByOrderId(Long orderId);
   

    List<OrderItem> findByProductId(Long productId);
}