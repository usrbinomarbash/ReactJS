package com.petstore.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long orderId;

    @Column(name="customer_id")
    private Long customerId;

    @Column(name="employee_id")
    private Long employeeId;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="total")
    private Double total;

    @Column(name="payment_method")
    private String paymentMethod;

    public Order(){

    }

    public Order(Long customerId, Long employeeId, String paymentMethod){
        this.customerId=customerId;
        this.employeeId=employeeId;
        this.paymentMethod=paymentMethod;
        this.createdAt=LocalDateTime.now();
    }

    public Long getOrderId(){
        return orderId;
    }

    public Long getCustomerId(){
        return customerId;
    }

    public Long getEmployeeId(){
        return employeeId;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public Double getTotal(){
        return total;
    }

    
    public String getPaymentMethod(){
        return paymentMethod;
    }

        public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }



    
}
