package com.petstore.backend.controller;

import com.petstore.backend.model.Product;
import com.petstore.backend.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product with id: " + id + " has been deleted successfully";
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String category
    ) {
        List<Product> results = productService.searchProducts(name, category);
        return ResponseEntity.ok(results);
    }

    /**
     * PUT /api/products/{id}/image
     *
     * Attaches an already-uploaded image URL to a product.
     * Call flow:
     *   1. Frontend POSTs the file to /api/upload  → gets back { url: "..." }
     *   2. Frontend PUTs { "imageUrl": "..." }  to this endpoint
     *
     * Body: { "imageUrl": "http://localhost:3388/api/uploads/abc123.jpg" }
     */
    @PutMapping("/{id}/image")
    public ResponseEntity<Product> setProductImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Product updated = productService.setProductImage(id, imageUrl);
        return ResponseEntity.ok(updated);
    }
}