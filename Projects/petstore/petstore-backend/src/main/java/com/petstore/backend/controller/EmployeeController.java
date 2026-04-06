package com.petstore.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.petstore.backend.model.Employee;
import com.petstore.backend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        System.out.println("GET /api/employees called");
        return employeeRepository.findAll();
    }

    // GET employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        System.out.println("GET /api/employees/" + id + " called");
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET available employees
    @GetMapping("/available")
    public List<Employee> getAvailableEmployees() {
        System.out.println("GET /api/employees/available called");
        return jdbcTemplate.query(
            "SELECT * FROM employee WHERE is_available = true ORDER BY name",
            (rs, rowNum) -> {
                Employee e = new Employee();
                e.setEmployeeId(rs.getLong("employee_id"));
                e.setName(rs.getString("name"));
                e.setEmail(rs.getString("email"));
                e.setPhone(rs.getString("phone"));
                e.setIsAvailable(rs.getBoolean("is_available"));
                return e;
            }
        );
    }

    // GET employee with performance stats
    @GetMapping("/{id}/stats")
    public Map<String, Object> getEmployeeStats(@PathVariable Long id) {
        System.out.println("GET /api/employees/" + id + "/stats called");
        return jdbcTemplate.queryForMap("""
            SELECT e.*,
                   (SELECT COUNT(*) FROM orders o WHERE o.employee_id = e.employee_id) as total_orders,
                   (SELECT COALESCE(SUM(total), 0) FROM orders o WHERE o.employee_id = e.employee_id) as total_sales,
                   (SELECT COUNT(*) FROM booking b WHERE b.employee_id = e.employee_id) as total_bookings
            FROM employee e
            WHERE e.employee_id = ?
            """, id);
    }

    // GET employee summary with stats
    @GetMapping("/summary")
    public List<Map<String, Object>> getEmployeeSummary() {
        System.out.println("GET /api/employees/summary called");
        return jdbcTemplate.queryForList("""
            SELECT e.employee_id, e.name, e.email, e.phone, e.hiring_date, e.is_available,
                   COUNT(DISTINCT o.order_id) as orders_processed,
                   COALESCE(SUM(o.total), 0) as total_sales,
                   COUNT(DISTINCT b.booking_id) as bookings_handled
            FROM employee e
            LEFT JOIN orders o ON e.employee_id = o.employee_id
            LEFT JOIN booking b ON e.employee_id = b.employee_id
            GROUP BY e.employee_id, e.name, e.email, e.phone, e.hiring_date, e.is_available
            ORDER BY total_sales DESC
            """);
    }

    // GET top performers
    @GetMapping("/top-performers")
    public List<Map<String, Object>> getTopPerformers() {
        System.out.println("GET /api/employees/top-performers called");
        return jdbcTemplate.queryForList("""
            SELECT e.employee_id, e.name, e.email, e.is_available,
                   COUNT(o.order_id) as orders_count,
                   COALESCE(SUM(o.total), 0) as total_sales
            FROM employee e
            LEFT JOIN orders o ON e.employee_id = o.employee_id
            GROUP BY e.employee_id, e.name, e.email, e.is_available
            ORDER BY total_sales DESC
            LIMIT 5
            """);
    }

    // POST create employee
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        System.out.println("POST /api/employees called");
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        System.out.println("PUT /api/employees/" + id + " called");
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setName(employeeDetails.getName());
                    existing.setEmail(employeeDetails.getEmail());
                    existing.setPhone(employeeDetails.getPhone());
                    existing.setHiringDate(employeeDetails.getHiringDate());
                    existing.setIsAvailable(employeeDetails.getIsAvailable());
                    return ResponseEntity.ok(employeeRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH toggle availability
    @PatchMapping("/{id}/availability")
    public ResponseEntity<Employee> toggleAvailability(@PathVariable Long id, @RequestParam Boolean available) {
        System.out.println("PATCH /api/employees/" + id + "/availability called");
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setIsAvailable(available);
                    return ResponseEntity.ok(employeeRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        System.out.println("DELETE /api/employees/" + id + " called");
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}