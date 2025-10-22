package com.petstore.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="pet")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pet_id;

    private String name;
    private String species;
    private String breed;
    private int age;

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer owner;

    //constructor
    public Pet(){

    }

    public Long getPet_Id()
    {
        return pet_id;
    }

    public void setPet_Id(Long pet_id){
        this.pet_id=pet_id;
    }


    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name=name;
    }

    public String getSpecies(){
        return species;
    }

    public void setSpecies(String species){
        this.species=species;
    }

    public String getBreed(){
        return breed;
    }

    public void setBreed(String breed){
        this.breed=breed;
    }

    public int getAge(){
        return age;
    }

    public void setAge(int age){
        this.age=age;
    }
    public Customer getOwner(){
        return owner;
    }

    public void setOwner(Customer owner){
        this.owner=owner;
    }
   
}
