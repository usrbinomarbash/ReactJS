package com.petstore.backend.service;

import com.petstore.backend.model.Pet;
import com.petstore.backend.model.Customer;
import com.petstore.backend.repository.PetRepository;
import com.petstore.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PetService {
    private final PetRepository petRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id " + id));
    }

    public Pet addPet(Pet pet) {
        if (pet.getCustomer() != null && pet.getCustomer().getCustomerId() != null) {
            Customer customer = customerRepository.findById(pet.getCustomer().getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            pet.setCustomer(customer);
        }
        return petRepository.save(pet);
    }

    public Pet updatePet(Long id, Pet updatedPet) {
        Pet existing = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id " + id));
        
        existing.setName(updatedPet.getName());
        existing.setSpecies(updatedPet.getSpecies());
        existing.setBreed(updatedPet.getBreed());
        existing.setAge(updatedPet.getAge());
        existing.setImageUrl(updatedPet.getImageUrl());
        
        if (updatedPet.getCustomer() != null && updatedPet.getCustomer().getCustomerId() != null) {
            Customer customer = customerRepository.findById(updatedPet.getCustomer().getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            existing.setCustomer(customer);
        }
        
        return petRepository.save(existing);
    }

    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Pet not found with id " + id);
        }
        petRepository.deleteById(id);
    }

    public List<Pet> searchPets(String name, String species) {
        if (name != null && !name.isEmpty()) {
            return petRepository.findByNameContainingIgnoreCase(name);
        }
        else if (species != null && !species.isEmpty()) {
            return petRepository.findBySpeciesContainingIgnoreCase(species);
        }
        return petRepository.findAll();
    }
}