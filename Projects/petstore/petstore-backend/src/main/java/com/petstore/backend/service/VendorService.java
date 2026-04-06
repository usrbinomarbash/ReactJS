package com.petstore.backend.service;

import com.petstore.backend.exception.ResourceNotFoundException;
import com.petstore.backend.model.Vendor;
import com.petstore.backend.repository.VendorRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class VendorService {
    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository){
        this.vendorRepository=vendorRepository;
    }

    //Transaction
    @Transactional(readOnly = true)
    public List<Vendor> getAllVendors(){
        return vendorRepository.findAll();
    }

    public Vendor createVendor(Vendor vendor){
        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(Long id, Vendor vendorDetails)
    {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(()-> new ResourceNotFoundException("Vendor","id",id));
            vendor.setName(vendorDetails.getName());
            vendor.setContactPerson(vendorDetails.getAreaCode());
            vendor.setAreaCode(vendorDetails.getAreaCode());
            vendor.setCountryCode(vendorDetails.getCountryCode());
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(Long id){
        if(!vendorRepository.existsById(id)){
            throw new ResourceNotFoundException("Vendor", "id",id);
        }
        vendorRepository.deleteById(id);
    }
}
