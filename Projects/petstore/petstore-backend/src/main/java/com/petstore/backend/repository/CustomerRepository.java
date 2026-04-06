package com.petstore.backend.repository;

import com.petstore.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query
    (value="SELECT * FROM Customer", nativeQuery=true)
    List<Customer>findAllCustomers();

    /*
    place joins, selects, update, delete insert in here and call them in service layer

    
    */

    List<Customer> findByFullNameContainingIgnoreCase(String name);
    List<Customer> findByEmailContainingIgnoreCase(String email);
    List<Customer> findByPhoneContaining(String phone);
    List<Customer> findByAddressContainingIgnoreCase(String address);
    

    @Query(value= "SELECT * FROM customer ORDER BY full_name", nativeQuery=true)
    List<Customer> findAllOrderByName();

    @Query(value="SELECT * FROM customer WHERE email = :email", nativeQuery = true)
    Customer findByEmail(String email);


    //customer with at least one order
    @Query(value="""
            SELECT DISTINCT c.*
            FROM CUSTOMER c
            INNER JOIN orders o ON c.customer_id=o.customer_id
            ORDER BY c.full_name
            """, nativeQuery = true)
    List<Customer> findCustomersWithCorders();


    @Query(value="SELECT * FROM Customer WHERE customer_id=:customerId", nativeQuery = true)
    Customer findCustomerById(Long customerId);

    @Query(value="""
       SELECT DISTINCT c.*
       FROM customer c
       INNER JOIN orders o ON c.customer_id=o.customer_id
       ORDER BY c.full_name     
    """, nativeQuery = true)
    List<Customer> findCustomersWithOrders();

       @Query(value="""
       SELECT DISTINCT c.*
       FROM customer c
       LEFT JOIN orders o ON c.customer_id=o.customer_id
       GROUP BY c.customer_id,c.full_name
       ORDER BY order_cnt DESC     
    """, nativeQuery = true)
    List<Customer> findCustomersWithoutOrders();

    @Query(value="""
            SELECT c.full_name, COUNT(o.order_id) AS order_cnt
            FROM customer c
            LEFT JOIN orders o ON c.customer_id=o.customer_id
            GROUP BY c.customer_id, c.full_name
            ORDER BY order_cnt DESC
            """, nativeQuery = true)
    List<Object[]> countOrdersPerCustomer();


    
}
