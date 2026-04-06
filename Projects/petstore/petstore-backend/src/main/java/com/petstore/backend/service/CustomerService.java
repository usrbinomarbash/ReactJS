package com.petstore.backend.service;

import com.petstore.backend.model.Customer;
import com.petstore.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    //  Gets all the customers from the database
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Searches the database for a customer by ID
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    //  Saves a customer to the database
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer); // <-- missing semicolon fixed
    }

    //  Deletes a customer by ID
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Customer not found with ID: " + id);
        }
        customerRepository.deleteById(id);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        existing.setFullName(updatedCustomer.getFullName());
        existing.setEmail(updatedCustomer.getEmail());
        existing.setPhone(updatedCustomer.getPhone());
        existing.setAddress(updatedCustomer.getAddress());

        return customerRepository.save(existing);
    }

    public List<Customer> searchCustomers(String name, String email, String phone){
        if(name != null && !name.isEmpty()){
            return customerRepository.findByFullNameContainingIgnoreCase(name);
        }
        else if(email != null && !email.isEmpty()){
            return customerRepository.findByEmailContainingIgnoreCase(email);
        }
        else if(phone != null && !phone.isEmpty()){
            return customerRepository.findByPhoneContaining(phone);
        }
        return customerRepository.findAll();
    }

}
