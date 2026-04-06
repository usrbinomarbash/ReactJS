package com.petstore.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.petstore.backend.model.Service;
import com.petstore.backend.repository.ServiceRepository;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET all services
    @GetMapping
    public List<Service> getAllServices() {
        System.out.println("GET /api/services called");
        return serviceRepository.findAll();
    }

    // GET service by ID
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        System.out.println("GET /api/services/" + id + " called");
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET service with booking stats
    @GetMapping("/{id}/stats")
    public Map<String, Object> getServiceStats(@PathVariable Long id) {
        System.out.println("GET /api/services/" + id + "/stats called");
        return jdbcTemplate.queryForMap("""
            SELECT s.*,
                   (SELECT COUNT(*) FROM booking b WHERE b.service_type = s.name) as total_bookings,
                   (SELECT COUNT(*) FROM booking b WHERE b.service_type = s.name) * s.price as total_revenue
            FROM service s
            WHERE s.service_id = ?
            """, id);
    }

    // GET popular services
    @GetMapping("/popular")
    public List<Map<String, Object>> getPopularServices() {
        System.out.println("GET /api/services/popular called");
        return jdbcTemplate.queryForList("""
            SELECT s.service_id, s.name, s.price, s.pet_type, s.duration_min,
                   COUNT(b.booking_id) as booking_count,
                   COUNT(b.booking_id) * s.price as total_revenue
            FROM service s
            LEFT JOIN booking b ON b.service_type = s.name
            GROUP BY s.service_id, s.name, s.price, s.pet_type, s.duration_min
            ORDER BY booking_count DESC
            LIMIT 5
            """);
    }

    // GET services by pet type
    @GetMapping("/pet-type/{petType}")
    public List<Service> getServicesByPetType(@PathVariable String petType) {
        System.out.println("GET /api/services/pet-type/" + petType + " called");
        return jdbcTemplate.query(
            "SELECT * FROM service WHERE LOWER(pet_type) = LOWER(?)",
            (rs, rowNum) -> {
                Service s = new Service();
                s.setServiceId(rs.getLong("service_id"));
                s.setName(rs.getString("name"));
                s.setPrice(rs.getDouble("price"));
                s.setPetType(rs.getString("pet_type"));
                s.setDuration(rs.getInt("duration_min"));
                return s;
            },
            petType
        );
    }

    // GET service summary
    @GetMapping("/summary")
    public List<Map<String, Object>> getServiceSummary() {
        System.out.println("GET /api/services/summary called");
        return jdbcTemplate.queryForList("""
            SELECT s.service_id, s.name, s.price, s.pet_type, s.duration_min,
                   COUNT(b.booking_id) as total_bookings,
                   COUNT(b.booking_id) * s.price as revenue
            FROM service s
            LEFT JOIN booking b ON b.service_type = s.name
            GROUP BY s.service_id, s.name, s.price, s.pet_type, s.duration_min
            ORDER BY s.name
            """);
    }

    // POST create service
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        System.out.println("POST /api/services called");
        Service saved = serviceRepository.save(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update service
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        System.out.println("PUT /api/services/" + id + " called");
        return serviceRepository.findById(id)
                .map(existing -> {
                    existing.setName(serviceDetails.getName());
                    existing.setPrice(serviceDetails.getPrice());
                    existing.setPetType(serviceDetails.getPetType());
                    existing.setDuration(serviceDetails.getDurationMin());
                    return ResponseEntity.ok(serviceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        System.out.println("DELETE /api/services/" + id + " called");
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}