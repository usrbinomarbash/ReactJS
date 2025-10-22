package com.petstore.backend.controller;


import com.petstore.backend.model.Customer;
import com.petstore.backend.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "https://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService){
        this.customerService=customerService;
    }

    //get request
    @GetMapping
    public List<Customer> getAllCustomers(){
        return customerService.getAllCustomers();
    }


    //get request

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id){
        return customerService.getCustomerById(id);
    }


    //post request
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer){
        return customerService.addCustomer(customer);
    }


    //delete request
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
    }


}
