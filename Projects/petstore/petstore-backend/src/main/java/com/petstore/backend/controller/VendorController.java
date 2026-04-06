package com.petstore.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.petstore.backend.model.Vendor;
import com.petstore.backend.repository.VendorRepository;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET all vendors
    @GetMapping
    public List<Vendor> getAllVendors() {
        System.out.println("GET /api/vendors called");
        return vendorRepository.findAll();
    }

    // GET vendor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        System.out.println("GET /api/vendors/" + id + " called");
        return vendorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET vendor with product details
    @GetMapping("/{id}/products")
    public Map<String, Object> getVendorWithProducts(@PathVariable Long id) {
        System.out.println("GET /api/vendors/" + id + "/products called");
        
        Map<String, Object> vendor = jdbcTemplate.queryForMap(
            "SELECT * FROM vendor WHERE vendor_id = ?", id
        );

        List<Map<String, Object>> products = jdbcTemplate.queryForList(
            "SELECT * FROM product WHERE vendor_id = ?", id
        );

        vendor.put("products", products);
        vendor.put("product_count", products.size());
        return vendor;
    }

    // GET vendor summary (all vendors with product counts)
    @GetMapping("/summary")
    public List<Map<String, Object>> getVendorSummary() {
        System.out.println("GET /api/vendors/summary called");
        return jdbcTemplate.queryForList("""
            SELECT v.*,
                   COUNT(p.product_id) as product_count,
                   COALESCE(SUM(p.stock_quantity), 0) as total_stock,
                   COALESCE(SUM(p.stock_quantity * p.price), 0) as inventory_value
            FROM vendor v
            LEFT JOIN product p ON v.vendor_id = p.vendor_id
            GROUP BY v.vendor_id, v.name, v.contact_person, v.area_code, v.country_code
            ORDER BY product_count DESC
            """);
    }

    // GET vendor performance (products sold)
    @GetMapping("/performance")
    public List<Map<String, Object>> getVendorPerformance() {
        System.out.println("GET /api/vendors/performance called");
        return jdbcTemplate.queryForList("""
            SELECT v.vendor_id, v.name, v.contact_person,
                   COUNT(DISTINCT p.product_id) as products_supplied,
                   COALESCE(SUM(oi.quantity), 0) as units_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
            FROM vendor v
            LEFT JOIN product p ON v.vendor_id = p.vendor_id
            LEFT JOIN order_item oi ON p.product_id = oi.product_id
            GROUP BY v.vendor_id, v.name, v.contact_person
            ORDER BY revenue DESC
            """);
    }

    // GET vendors by country code
    @GetMapping("/country/{countryCode}")
    public List<Vendor> getVendorsByCountry(@PathVariable String countryCode) {
        System.out.println("GET /api/vendors/country/" + countryCode + " called");
        return jdbcTemplate.query(
            "SELECT * FROM vendor WHERE country_code = ?",
            (rs, rowNum) -> {
                Vendor v = new Vendor();
                v.setVendorId(rs.getLong("vendor_id"));
                v.setName(rs.getString("name"));
                v.setContactPerson(rs.getString("contact_person"));
                v.setAreaCode(rs.getString("area_code"));
                v.setCountryCode(rs.getString("country_code"));
                return v;
            },
            countryCode
        );
    }

    // POST create vendor
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        System.out.println("POST /api/vendors called");
        Vendor saved = vendorRepository.save(vendor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update vendor
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor vendorDetails) {
        System.out.println("PUT /api/vendors/" + id + " called");
        return vendorRepository.findById(id)
                .map(existing -> {
                    existing.setName(vendorDetails.getName());
                    existing.setContactPerson(vendorDetails.getContactPerson());
                    existing.setAreaCode(vendorDetails.getAreaCode());
                    existing.setCountryCode(vendorDetails.getCountryCode());
                    return ResponseEntity.ok(vendorRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE vendor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        System.out.println("DELETE /api/vendors/" + id + " called");
        if (vendorRepository.existsById(id)) {
            vendorRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}