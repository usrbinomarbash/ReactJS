package com.petstore.backend.model;

import jakarta.persistence.*;


@Entity
@Table(name="service")
public class Service{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="service_id")
    private Long serviceId;

    @Column(name="name")
    private String name;

    private Double price;

    @Column(name="pet_type")
    private String petType;


    @Column(name="duration_min")
    private Integer durationMin;

    public Long getServiceId(){
        return serviceId;
    }

    public void setServiceId(Long serviceId){
        this.serviceId=serviceId;
    }

    public void setName(String name){
        this.name=name;
    }

    public String getName(){
        return name;
    }

    public void setPrice(Double price){
        this.price=price;
    }

    public Double getPrice(){
        return price;
    }

    public void setPetType(String petType){
        this.petType=petType;
    }

    public String getPetType(){
        return petType;
    }

    public void setDuration(Object durationMin)
    {
        this.durationMin=(Integer) durationMin;
    }

    public Integer getDurationMin(){
        return durationMin;
    }

    public Object getDescription() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDescription'");
    }

}