package com.petstore.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SearchController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Global search across all entities
    @GetMapping
    public Map<String, Object> globalSearch(@RequestParam String q) {
        System.out.println("GET /api/search?q=" + q + " called");
        String searchTerm = "%" + q.toLowerCase() + "%";

        Map<String, Object> results = new HashMap<>();

        List<Map<String, Object>> customers = jdbcTemplate.queryForList(
            "SELECT customer_id, full_name, email, 'customer' as type FROM customer WHERE LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? LIMIT 5",
            searchTerm, searchTerm
        );

        List<Map<String, Object>> products = jdbcTemplate.queryForList(
            "SELECT product_id, name, category, price, 'product' as type FROM product WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(description, '')) LIKE ? LIMIT 5",
            searchTerm, searchTerm
        );

        List<Map<String, Object>> pets = jdbcTemplate.queryForList(
            "SELECT pet_id, name, species, breed, 'pet' as type FROM pet WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(breed, '')) LIKE ? LIMIT 5",
            searchTerm, searchTerm
        );

        List<Map<String, Object>> services = jdbcTemplate.queryForList(
            "SELECT service_id, name, price, 'service' as type FROM service WHERE LOWER(name) LIKE ? LIMIT 5",
            searchTerm
        );

        List<Map<String, Object>> employees = jdbcTemplate.queryForList(
            "SELECT employee_id, name, email, 'employee' as type FROM employee WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(email, '')) LIKE ? LIMIT 5",
            searchTerm, searchTerm
        );

        List<Map<String, Object>> vendors = jdbcTemplate.queryForList(
            "SELECT vendor_id, name, contact_person, 'vendor' as type FROM vendor WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(contact_person, '')) LIKE ? LIMIT 5",
            searchTerm, searchTerm
        );

        results.put("customers", customers);
        results.put("products", products);
        results.put("pets", pets);
        results.put("services", services);
        results.put("employees", employees);
        results.put("vendors", vendors);
        results.put("query", q);
        results.put("totalResults", customers.size() + products.size() + pets.size() + 
                                    services.size() + employees.size() + vendors.size());

        return results;
    }

    // Advanced product search
    @GetMapping("/products")
    public List<Map<String, Object>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long vendorId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        System.out.println("GET /api/search/products called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT p.*, c.name as category_name, v.name as vendor_name
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN vendor v ON p.vendor_id = v.vendor_id
            WHERE 1=1
            """);

        if (name != null && !name.isEmpty()) {
            sql.append(" AND LOWER(p.name) LIKE '%").append(name.toLowerCase()).append("%'");
        }
        if (categoryId != null) {
            sql.append(" AND p.category_id = ").append(categoryId);
        }
        if (vendorId != null) {
            sql.append(" AND p.vendor_id = ").append(vendorId);
        }
        if (minPrice != null) {
            sql.append(" AND p.price >= ").append(minPrice);
        }
        if (maxPrice != null) {
            sql.append(" AND p.price <= ").append(maxPrice);
        }
        if (inStock != null && inStock) {
            sql.append(" AND p.stock_quantity > 0");
        }

        // Validate sortBy to prevent SQL injection
        String validSortBy = switch (sortBy.toLowerCase()) {
            case "price" -> "p.price";
            case "stock_quantity" -> "p.stock_quantity";
            case "category" -> "p.category";
            default -> "p.name";
        };
        
        sql.append(" ORDER BY ").append(validSortBy).append(" ")
           .append(sortOrder.equalsIgnoreCase("desc") ? "DESC" : "ASC");
        
        return jdbcTemplate.queryForList(sql.toString());
    }

    // Advanced customer search
    @GetMapping("/customers")
    public List<Map<String, Object>> searchCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Boolean hasOrders,
            @RequestParam(required = false) Boolean hasPets) {
        
        System.out.println("GET /api/search/customers called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT c.*,
                   (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) as order_count,
                   (SELECT COUNT(*) FROM pet p WHERE p.customer_id = c.customer_id) as pet_count
            FROM customer c
            WHERE 1=1
            """);

        if (name != null && !name.isEmpty()) {
            sql.append(" AND LOWER(c.full_name) LIKE '%").append(name.toLowerCase()).append("%'");
        }
        if (email != null && !email.isEmpty()) {
            sql.append(" AND LOWER(c.email) LIKE '%").append(email.toLowerCase()).append("%'");
        }
        if (phone != null && !phone.isEmpty()) {
            sql.append(" AND c.phone LIKE '%").append(phone).append("%'");
        }
        if (hasOrders != null && hasOrders) {
            sql.append(" AND EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)");
        }
        if (hasPets != null && hasPets) {
            sql.append(" AND EXISTS (SELECT 1 FROM pet p WHERE p.customer_id = c.customer_id)");
        }

        sql.append(" ORDER BY c.full_name");
        
        return jdbcTemplate.queryForList(sql.toString());
    }

    // Search orders by date range and filters
    @GetMapping("/orders")
    public List<Map<String, Object>> searchOrders(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount) {
        
        System.out.println("GET /api/search/orders called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT o.*, c.full_name as customer_name, e.name as employee_name,
                   (SELECT COUNT(*) FROM order_item oi WHERE oi.order_id = o.order_id) as item_count
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.customer_id
            LEFT JOIN employee e ON o.employee_id = e.employee_id
            WHERE 1=1
            """);

        if (startDate != null) {
            sql.append(" AND o.created_at >= '").append(startDate).append("'");
        }
        if (endDate != null) {
            sql.append(" AND o.created_at <= '").append(endDate).append(" 23:59:59'");
        }
        if (customerId != null) {
            sql.append(" AND o.customer_id = ").append(customerId);
        }
        if (employeeId != null) {
            sql.append(" AND o.employee_id = ").append(employeeId);
        }
        if (paymentMethod != null && !paymentMethod.isEmpty()) {
            sql.append(" AND o.payment_method = '").append(paymentMethod).append("'");
        }
        if (minAmount != null) {
            sql.append(" AND o.total >= ").append(minAmount);
        }
        if (maxAmount != null) {
            sql.append(" AND o.total <= ").append(maxAmount);
        }

        sql.append(" ORDER BY o.created_at DESC");
        
        return jdbcTemplate.queryForList(sql.toString());
    }

    // Search bookings
    @GetMapping("/bookings")
    public List<Map<String, Object>> searchBookings(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long petId,
            @RequestParam(required = false) String serviceType) {
        
        System.out.println("GET /api/search/bookings called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT b.*, c.full_name as customer_name, c.phone as customer_phone,
                   p.name as pet_name, p.species as pet_species
            FROM booking b
            LEFT JOIN customer c ON b.customer_id = c.customer_id
            LEFT JOIN pet p ON b.pet_id = p.pet_id
            WHERE 1=1
            """);

        if (startDate != null) {
            sql.append(" AND b.date >= '").append(startDate).append("'");
        }
        if (endDate != null) {
            sql.append(" AND b.date <= '").append(endDate).append("'");
        }
        if (customerId != null) {
            sql.append(" AND b.customer_id = ").append(customerId);
        }
        if (petId != null) {
            sql.append(" AND b.pet_id = ").append(petId);
        }
        if (serviceType != null && !serviceType.isEmpty()) {
            sql.append(" AND LOWER(b.service_type) LIKE '%").append(serviceType.toLowerCase()).append("%'");
        }

        sql.append(" ORDER BY b.date DESC");
        
        return jdbcTemplate.queryForList(sql.toString());
    }

    // Search pets
    @GetMapping("/pets")
    public List<Map<String, Object>> searchPets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) Long customerId) {
        
        System.out.println("GET /api/search/pets called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT p.*, c.full_name as owner_name, c.phone as owner_phone
            FROM pet p
            LEFT JOIN customer c ON p.customer_id = c.customer_id
            WHERE 1=1
            """);

        if (name != null && !name.isEmpty()) {
            sql.append(" AND LOWER(p.name) LIKE '%").append(name.toLowerCase()).append("%'");
        }
        if (species != null && !species.isEmpty()) {
            sql.append(" AND LOWER(p.species) LIKE '%").append(species.toLowerCase()).append("%'");
        }
        if (breed != null && !breed.isEmpty()) {
            sql.append(" AND LOWER(p.breed) LIKE '%").append(breed.toLowerCase()).append("%'");
        }
        if (minAge != null) {
            sql.append(" AND p.age >= ").append(minAge);
        }
        if (maxAge != null) {
            sql.append(" AND p.age <= ").append(maxAge);
        }
        if (customerId != null) {
            sql.append(" AND p.customer_id = ").append(customerId);
        }

        sql.append(" ORDER BY p.name");
        
        return jdbcTemplate.queryForList(sql.toString());
    }

    // Search employees
    @GetMapping("/employees")
    public List<Map<String, Object>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email) {
        
        System.out.println("GET /api/search/employees called");
        
        StringBuilder sql = new StringBuilder("""
            SELECT e.*,
                   (SELECT COUNT(*) FROM orders o WHERE o.employee_id = e.employee_id) as orders_handled
            FROM employee e
            WHERE 1=1
            """);

        if (name != null && !name.isEmpty()) {
            sql.append(" AND LOWER(e.name) LIKE '%").append(name.toLowerCase()).append("%'");
        }
        if (email != null && !email.isEmpty()) {
            sql.append(" AND LOWER(e.email) LIKE '%").append(email.toLowerCase()).append("%'");
        }

        sql.append(" ORDER BY e.name");
        
        return jdbcTemplate.queryForList(sql.toString());
    }
}