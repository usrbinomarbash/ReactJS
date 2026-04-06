package com.petstore.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "hiring_date")
    private LocalDate hiringDate;

    @Column(name = "is_available")
    private Boolean isAvailable;

    public Employee() {}

    // Getters
    public Long getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public LocalDate getHiringDate() { return hiringDate; }
    public Boolean getIsAvailable() { return isAvailable; }

    // Setters
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setEmail(String email) { this.email = email; }
    public void setHiringDate(LocalDate hiringDate) { this.hiringDate = hiringDate; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    @Override
    public String toString() {
        return "Employee{employeeId=" + employeeId + ", name='" + name + "'}";
    }
}