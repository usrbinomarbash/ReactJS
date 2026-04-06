package com.petstore.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendor")
public class Vendor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "name")
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "area_code")
    private String areaCode;

    @Column(name = "country_code")
    private String countryCode;

    // ========== CONSTRUCTORS ==========

    public Vendor() {
    }

    public Vendor(String name, String contactPerson, String areaCode, String countryCode) {
        this.name = name;
        this.contactPerson = contactPerson;
        this.areaCode = areaCode;
        this.countryCode = countryCode;
    }

    // ========== GETTERS ==========

    public Long getVendorId() {
        return vendorId;
    }

    public String getName() {
        return name;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    // ========== SETTERS ==========

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    // ========== EQUALS, HASHCODE, TOSTRING ==========

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vendor vendor = (Vendor) o;
        return vendorId != null && vendorId.equals(vendor.vendorId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Vendor{" +
                "vendorId=" + vendorId +
                ", name='" + name + '\'' +
                ", contactPerson='" + contactPerson + '\'' +
                ", areaCode='" + areaCode + '\'' +
                ", countryCode='" + countryCode + '\'' +
                '}';
    }
}