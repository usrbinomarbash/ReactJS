package com.petstore.backend.repository;

import java.util.List;
import com.petstore.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query(value = "SELECT * FROM pet WHERE customer_id = :customerId", nativeQuery = true)
    List<Pet> findByCustomer(Long customerId);

    List<Pet> findByNameContainingIgnoreCase(String name);
    List<Pet> findBySpeciesContainingIgnoreCase(String species);
    List<Pet> findByBreedContainingIgnoreCase(String breed);
    List<Pet> findByCustomerCustomerId(Long customerId);

    @Query(value = """
            SELECT p.pet_id, p.name, p.species, p.breed, c.full_name AS owner_name
            FROM pet p
            INNER JOIN customer c ON p.customer_id = c.customer_id
            ORDER BY owner_name, p.name
            """, nativeQuery = true)
    List<Object[]> findPetStoreWithOwners();

    @Query(value = """
            SELECT c.full_name, COUNT(p.pet_id) AS pet_cnt
            FROM customer c
            LEFT JOIN pet p ON c.customer_id = p.customer_id
            GROUP BY c.customer_id, c.full_name
            ORDER BY pet_cnt DESC
            """, nativeQuery = true)
    List<Object[]> cntPetsPerCustomer();
}