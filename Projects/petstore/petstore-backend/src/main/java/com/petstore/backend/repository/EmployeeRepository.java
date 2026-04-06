package com.petstore.backend.repository;
import com.petstore.backend.model.Employee;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>{
    @Query
    (
        value="SELECT * FROM Employee",
        nativeQuery = true
    )
    List<Employee>findAllEmployees(); 

    @Query
    (
        value="SELECT * FROM employee ORDER BY name", nativeQuery = true
    )
    List<Employee>findAllOrderByName();

    @Query
    (
        value="SELECT * FROM employee WHERE employee_id=:employee_id", nativeQuery = true
    )
    Employee findByEmployeeId(Long employeeId);

    @Query(
        value="SELECT * FROM employee WHERE is_available=true", nativeQuery = true
    )
    Employee findAvailableEmployees();

    @Query(
        value="""
        SELECT e.*, COUNT(b.booking_id) AS booking_count
        FROM employee e
        LEFT JOIN booking b ON e.employee_id=b.employee_id
        GROUP BY employee_id
        ORDER BY booking_count DESC
        """, nativeQuery = true
    )
    List<Object []> findEmployeesWithBookingCount();

    @Query(
        value="""
        SELECT e.*, COUNT(o.order_id) AS order_count
        FROM employee e
        LEFT JOIN orders o ON e.employee_id=o.employee_id
        GROUP BY employee_id
        ORDER BY order_cnt DESC
        """, nativeQuery = true)
    List<Object []> findAllEmployeesWithOrderCount();
    
}

