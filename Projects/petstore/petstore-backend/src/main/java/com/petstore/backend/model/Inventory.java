package com.petstore.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "change_quantity")
    private Integer changeQuantity;

    @Column(name = "reason")
    private String reason;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "in_date")
    private LocalDate inDate;

    public Inventory() {
        this.inDate = LocalDate.now();
    }

    public Inventory(Long productId, Integer changeQuantity, String reason) {
        this.productId = productId;
        this.changeQuantity = changeQuantity;
        this.reason = reason;
        this.inDate = LocalDate.now();
    }


    public Long getLogId()
    {
         return logId;
    }

    public Long getProductId() { return productId; }
    public Integer getChangeQuantity() { return changeQuantity; }
    public String getReason() { return reason; }
    public LocalDate getInDate() { return inDate; }

   

    public void setLogId(Long logId)
    { 
        this.logId = logId;
    }


    public void setProductId(Long productId)
    {
        this.productId = productId;
    }


    public void setChangeQuantity(Integer changeQuantity)
    {
        this.changeQuantity = changeQuantity;
    }


    public void setReason(String reason)
    {
        this.reason = reason;
    }

    public void setInDate(LocalDate inDate)
    {
        this.inDate = inDate;
    }

    @Override
    public String toString() {
        return "Inventory{" +
                "logId=" + logId +
                ", productId=" + productId +
                ", changeQuantity=" + changeQuantity +
                ", reason='" + reason + '\'' +
                ", inDate=" + inDate +
                '}';
    }
}