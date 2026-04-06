package com.petstore.backend.request;

public class BookingRequest {

    private String date;
    private Long customerId;
    private Long petId;
    private String serviceType;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(String date, Long customerId, Long petId, String serviceType) {
        this.date = date;
        this.customerId = customerId;
        this.petId = petId;
        this.serviceType = serviceType;
    }

    // Getters
    public String getDate() {
        return date;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getPetId() {
        return petId;
    }

    public String getServiceType() {
        return serviceType;
    }

    // Setters
    public void setDate(String date) {
        this.date = date;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

   
    @Override
    public String toString() {
        return "BookingRequest{" +
                "date='" + date + '\'' +
                ", customerId=" + customerId +
                ", petId=" + petId +
                ", serviceType='" + serviceType + '\'' +
                '}';
    }
}