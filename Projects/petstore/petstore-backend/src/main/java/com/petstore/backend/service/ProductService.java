package com.petstore.backend.service;

import com.petstore.backend.exception.ResourceNotFoundException;
import com.petstore.backend.model.Product;
import com.petstore.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        log.debug("Fetching all products");
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        log.debug("Fetching product with ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    public Product addProduct(Product product) {
        log.info("Adding new product: {}", product.getName());

        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new IllegalArgumentException("Product price must be greater than 0");
        }

        Product saved = productRepository.save(product);
        log.info("Product saved with ID: {}", saved.getProductId());
        return saved;
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        log.info("Updating product with ID: {}", id);

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        existing.setName(updatedProduct.getName());
        existing.setCategory(updatedProduct.getCategory());
        existing.setPrice(updatedProduct.getPrice());
        existing.setDescription(updatedProduct.getDescription());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setVendorId(updatedProduct.getVendorId());
        existing.setCategoryId(updatedProduct.getCategoryId());
        // Preserve imageUrl if the update payload doesn't include one
        if (updatedProduct.getImageUrl() != null) {
            existing.setImageUrl(updatedProduct.getImageUrl());
        }

        Product saved = productRepository.save(existing);
        log.info("Product updated successfully");
        return saved;
    }

    // NEW: set or replace just the image URL — called from PUT /api/products/{id}/image
    public Product setProductImage(Long id, String imageUrl) {
        log.info("Setting image for product ID: {}", id);

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        existing.setImageUrl(imageUrl);
        Product saved = productRepository.save(existing);
        log.info("Image set: {}", imageUrl);
        return saved;
    }

    public void deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }

        productRepository.deleteById(id);
        log.info("Product deleted successfully");
    }

    public List<Product> searchProducts(String name, String category) {
        if (name != null && !name.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findByCategoryContainingIgnoreCase(category);
        }
        return productRepository.findAll();
    }
}