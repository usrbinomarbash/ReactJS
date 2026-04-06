package com.petstore.backend.repository;

import com.petstore.backend.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    @Query(value="SELECT * FROM vendor ORDER BY name", nativeQuery = true)
    List<Vendor> getAllOrderByName();


    @Query(value= """
        SELECT  v.name, COUNT(p.product_id) AS prods_cnt
        FROM Vendor v
        LEFT JOIN product p ON v.vendor_id=p.vendor_id
        GROUP BY v.vendor_id, v.name
        ORDER BY prods_cnt DESC
        """, nativeQuery=true )
    List<Object[] > countProductsPerVendor();

}