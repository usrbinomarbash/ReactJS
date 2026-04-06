package com.petstore.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long product_id;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name required")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name="category_id")
    private Long categoryId;

    @Column(name="vendor_id")
    private Long vendorId;

    @Positive(message = "Price must be greater than 0")
    @Column(name = "price", nullable = false)
    private double price;

    @PositiveOrZero(message="Stock quantity cannot be negative")
    @Column(name="stock_quantity")
    private Integer stockQuantity;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    // ========== CONSTRUCTORS ==========
    
    public Product() {
    }

    public Product(String name, String category, double price, String description) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
    }

    // ========== GETTERS ==========
    
    public Long getProductId() {
        return product_id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public Long getVendorId(){
        return vendorId;
    }

    public Double getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public Integer getStockQuantity(){
        return stockQuantity;
    }

    // ========== SETTERS ==========
    
    public void setProductId(Long product_id) {
        this.product_id = product_id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setCategoryId(Long categoryId){
        this.categoryId=categoryId;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVendorId(Long vendorId){
        this.vendorId=vendorId;
    }

    public void setStockQuantity(Integer stockQuantity){
        this.stockQuantity=stockQuantity;
    }

    // ========== EQUALS, HASHCODE, TOSTRING ==========
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return product_id != null && product_id.equals(product.product_id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Product{" +
                "product_id=" + product_id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", description='" + description + '\'' +
                '}';
    }
}