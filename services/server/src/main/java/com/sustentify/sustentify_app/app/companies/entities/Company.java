package com.sustentify.sustentify_app.app.companies.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sustentify.sustentify_app.app.companies.enums.CompanyDepartment;
import com.sustentify.sustentify_app.app.companies.enums.Validation;
import com.sustentify.sustentify_app.app.products.entities.Product;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Column(unique = true, nullable = false)
    private String cnpj;

    private String address;

    @Column(unique = true, nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    private CompanyDepartment companyDepartment;

    @OneToMany(mappedBy = "company")
    @JsonIgnore
    private Set<Product> products;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private Validation validation;

    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private CompanyDocumentImage document;

    public Company() {
    }

    public Company(String name, String email, String password, String cnpj, String address,String phone, CompanyDepartment companyDepartment) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cnpj = cnpj;
        this.address = address;
        this.phone = phone;
        this.companyDepartment = companyDepartment;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public CompanyDepartment getCompanyDepartment() {
        return companyDepartment;
    }

    public void setCompanyDepartment(CompanyDepartment companyDepartment) {
        this.companyDepartment = companyDepartment;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public Validation getValidation() {
        return validation;
    }

    public void setValidation(Validation validation) {
        this.validation = validation;
    }

    public CompanyDocumentImage getDocument() {
        return document;
    }

    public void setDocument(CompanyDocumentImage document) {
        this.document = document;
    }

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + ", email=" + email + ", cnpj=" + cnpj + ", address=" + address + ", companyDepartment=" + companyDepartment + "]";
    }
}
