package com.petstore.backend.controller;

import com.petstore.backend.model.Customer;
import com.petstore.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        log.info("GET /api/customers - Fetching all customers");
        List<Customer> customers = customerService.getAllCustomers();
        log.info("Found {} customers", customers.size());
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        log.info("GET /api/customers/{} - Fetching customer", id);
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String phone
    )
    {
        List<Customer> results = customerService.searchCustomers(email, name,phone);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<Customer> addCustomer(@Valid @RequestBody Customer customer) {
        log.info("POST /api/customers - Creating customer: {}", customer.getFullName());
        Customer savedCustomer = customerService.addCustomer(customer);
        log.info("Customer created successfully with ID: {}", savedCustomer.getCustomerId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id, 
            @Valid 
            @RequestBody Customer customer) {
        log.info("PUT /api/customers/{} - Updating customer", id);
        Customer updatedCustomer = customerService.updateCustomer(id, customer);
        log.info("Customer updated successfully");
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        log.info("DELETE /api/customers/{} - Deleting customer", id);
        customerService.deleteCustomer(id);
        log.info("Customer deleted successfully");
        return ResponseEntity.noContent().build();
    }
}