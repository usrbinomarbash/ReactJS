package com.petstore.backend.model;

import java.io.Serializable;
import java.util.Objects;


public class OrderItemId implements Serializable {
    
    private Long orderId;
    private Long productId;

    
    public OrderItemId() {}


    public OrderItemId(Long orderId, Long productId) {
        this.orderId = orderId;
        this.productId = productId;
    }

   
    public Long getOrderId() 
    { 
        return orderId; 
    }

    public void setOrderId(Long orderId)
    { 
        this.orderId = orderId;
    }

    public Long getProductId()
    {
        return productId;
    }

    public void setProductId(Long productId)
    {
        this.productId = productId;
    }

    // equals and hashcode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderItemId that = (OrderItemId) o;
        return Objects.equals(orderId, that.orderId) && 
               Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, productId);
    }

    @Override
    public String toString() {
        return "OrderItemId{" +
                "orderId=" + orderId +
                ", productId=" + productId +
                '}';
    }
}