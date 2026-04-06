package com.petstore.backend.repository;

import com.petstore.backend.model.Booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings
    @Query(
        value = "SELECT * FROM booking",
        nativeQuery = true
    )
    List<Booking> findAllBookings();

    // Booking details with Customer, Pet, Employee (Multiple INNER JOINs)
    @Query(
        value = """
                SELECT b.booking_id, b.date,
                c.full_name AS customer_name,
                p.name AS pet_name,
                b.service_type AS service_name,
                e.name AS employee_name
                FROM booking b
                INNER JOIN customer c ON b.customer_id = c.customer_id
                INNER JOIN pet p ON b.pet_id = p.pet_id
                INNER JOIN employee e ON b.employee_id = e.employee_id
                ORDER BY b.date DESC
                """, nativeQuery = true)
    List<Object[]> findBookDetails();

    // Count bookings per customer (INNER JOIN + COUNT)
    @Query(
        value = """
                SELECT c.full_name, COUNT(b.booking_id) AS booking_count
                FROM customer c
                INNER JOIN booking b ON c.customer_id = b.customer_id
                GROUP BY c.customer_id, c.full_name
                ORDER BY booking_count DESC
                """, nativeQuery = true)
    List<Object[]> countBookingsPerCustomer();

    // Find bookings by customer
    @Query(
        value = "SELECT * FROM booking WHERE customer_id = :customerId",
        nativeQuery = true)
    List<Booking> findByCustomerId(Long customerId);

    // Find bookings by employee
    @Query(
        value = "SELECT * FROM booking WHERE employee_id = :employeeId",
        nativeQuery = true)
    List<Booking> findByEmployeeId(Long employeeId);

    // Find bookings by service type
    @Query(
        value = "SELECT * FROM booking WHERE service_type = :serviceType",
        nativeQuery = true)
    List<Booking> findByServiceType(String serviceType);
}