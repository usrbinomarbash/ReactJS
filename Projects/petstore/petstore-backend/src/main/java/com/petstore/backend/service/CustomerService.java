package com.petstore.backend.service;

import com.petstore.backend.model.Customer;
import com.petstore.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository){
        this.customerRepository=customerRepository;
    }


    //gets all the customers from the database
    public List<Customer> getAllCustomers(){
        return customerRepository.findAll();
    }


    //searches from the database the customer by id
    public Customer getCustomerById(Long id){
        return customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer Not Found"));
    }


    //save a customer to the database
    public Customer addCustomer(Customer customer){
        return customerRepository.save(customer)
    }

    //search for the customer by id in the database and delete him
    public void deleteCustomer(Long id){
        customerRepository.deleteById(id);
    }
    
}
