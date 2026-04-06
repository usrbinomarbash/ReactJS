package com.petstore.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Entity
@Table(name = "booking")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotBlank(message = "Service type is required")
    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @NotNull(message = "Customer is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @NotNull(message = "Pet is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "status", length = 20)
    private String status;

    // ========== CONSTRUCTORS ==========
    
    public Booking() {
    }

    public Booking(LocalDate date, String serviceType, Customer customer, Pet pet, Employee employee, String status) {
        this.date = date;
        this.serviceType = serviceType;
        this.customer = customer;
        this.pet = pet;
        this.employee = employee;
        this.status = status;
    }

    // ========== GETTERS ==========
    
    public Long getBookingId() {
        return bookingId;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getServiceType() {
        return serviceType;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Pet getPet() {
        return pet;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getStatus() {
        return status;
    }

    // ========== SETTERS ==========
    
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ========== EQUALS, HASHCODE, TOSTRING ==========
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return bookingId != null && bookingId.equals(booking.bookingId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Booking{" +
                "bookingId=" + bookingId +
                ", date=" + date +
                ", serviceType='" + serviceType + '\'' +
                ", status='" + status + '\'' +
                ", customerId=" + (customer != null ? customer.getCustomerId() : null) +
                ", petId=" + (pet != null ? pet.getPetId() : null) +
                ", employeeId=" + (employee != null ? employee.getEmployeeId() : null) +
                '}';
    }
}