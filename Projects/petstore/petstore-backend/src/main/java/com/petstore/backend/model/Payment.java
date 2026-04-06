package com.petstore.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paymentid")
    private Long paymentId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "paymentdate")
    private LocalDate paymentDate;

    @Column(name = "status")
    private String status;

    // Constructors
    public Payment() {}

    public Payment(Long orderId, Double amount, String paymentMethod, String status) {
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
    }

    // Getters
    public Long getPaymentId()
    { 
        return paymentId;
    }

    public Long getOrderId(){
        return orderId;
    }

    public Double getAmount()
    { 
        return amount;
    }

    public String getPaymentMethod()
    {
        return paymentMethod;
    }

    public LocalDate getPaymentDate()
    { 
        return paymentDate;
    }

    public String getStatus()
    {
        return status;
    }

    
    public void setPaymentId(Long paymentId)
    {
        this.paymentId = paymentId;
    }

    public void setOrderId(Long orderId)
    {
        this.orderId = orderId;
    }

    public void setAmount(Double amount)
    {
        this.amount = amount;
    }

    public void setPaymentMethod(String paymentMethod)
    {
        this.paymentMethod = paymentMethod;
    }

    public void setPaymentDate(LocalDate paymentDate) 
    {
        this.paymentDate = paymentDate;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId=" + paymentId +
                ", orderId=" + orderId +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                '}';
    }
}