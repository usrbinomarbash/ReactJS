package com.petstore.backend.repository;

import com.petstore.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find orders by customer
    List<Order> findByCustomerId(Long customerId);
    
    // Find orders by employee
    List<Order> findByEmployeeId(Long employeeId);
    
    // Find orders by payment method
    List<Order> findByPaymentMethod(String paymentMethod);
}