package com.petstore.backend.controller;
import com.petstore.backend.service.PetService;
import com.petstore.backend.model.Pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private final PetService petService;

    public PetController(PetService petService){
        this.petService = petService;
    }

    @GetMapping
    public List<Pet> getAllPets(){
        return petService.getAllPets();
    }


    @GetMapping("/{id}")
    public Pet getPetById(@PathVariable Long id) {
        return petService.getPetById(id);
    }

    @GetMapping("/search")
    public ResponseEntity<List <Pet>> searchPets(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String species
    )
    {
        List<Pet> results = petService.searchPets(name, species);
        return ResponseEntity.ok(results);
    }

    // add a pet
    @PostMapping
    public Pet addPet(@RequestBody Pet pet) {
        return petService.addPet(pet);
    }

    // update a pet
    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        return petService.updatePet(id, pet);
    }

    // delete a pet
    @DeleteMapping("/{id}")
    public String deletePet(@PathVariable Long id){
        petService.deletePet(id);
        return "Pet with id: " + id + " has been deleted successfully";
    }
}