package com.petstore.backend.repository;
import com.petstore.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Long>{
    
}
