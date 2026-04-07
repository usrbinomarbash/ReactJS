package com.petstore.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.petstore.backend.model.Category;
import com.petstore.backend.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET all categories
    @GetMapping
    public List<Category> getAllCategories() {
        System.out.println("GET /api/categories called");
        return categoryRepository.findAll();
    }

    // GET all categories ordered by name
    @GetMapping("/ordered")
    public List<Category> getAllCategoriesOrdered() {
        System.out.println("GET /api/categories/ordered called");
        return categoryRepository.findAllOrderByName();
    }

    // GET product count per category
    @GetMapping("/product-count")
    public List<Object[]> getProductCountPerCategory() {
        System.out.println("GET /api/categories/product-count called");
        return categoryRepository.countProductsPerCategory();
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        System.out.println("GET /api/categories/" + id + " called");
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(category))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        System.out.println("POST /api/categories called");
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    // PUT update category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        System.out.println("PUT /api/categories/" + id + " called");
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(categoryDetails.getName());
                    existingCategory.setDescription(categoryDetails.getDescription());
                    Category updatedCategory = categoryRepository.save(existingCategory);
                    return ResponseEntity.ok(updatedCategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        System.out.println("DELETE /api/categories/" + id + " called");
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}