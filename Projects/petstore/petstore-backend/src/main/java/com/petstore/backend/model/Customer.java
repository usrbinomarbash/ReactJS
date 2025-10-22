package com.petstore.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="customer")
public class Customer{
    @Id
    @GeneratedValue(strategy = GeneratedValue.IDENTITY)
    private Long customer_id; //done

    private String name; //done
    private String phone; //done
    private String address;

    public Customer(){
        
    }

    public void setCustomerId(Long customer_id)
    {
        this.customer_id=customer_id;
    }

    public Long getCustomerId(){
        return customer_id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name=name;
    }

    public String getPhone(){
        return phone;
    }

    public void setPhone(String phone){
        this.phone=phone;
    }

    public void setAddress(String address){
        this.address=address;
    }

    public String getAddress(){
        return address;
    }



}