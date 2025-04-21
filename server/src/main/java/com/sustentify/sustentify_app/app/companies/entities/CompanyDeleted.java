package com.sustentify.sustentify_app.app.companies.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "companies_deleted")
public class CompanyDeleted {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String cnpj;

    private String address;

    private String phone;

    @Enumerated(EnumType.STRING)
    private CompanyDepartment companyDepartment;

    public CompanyDeleted() {
    }

    public CompanyDeleted(Company company) {
        this.id = UUID.randomUUID();
        this.name = company.getName();
        this.email = company.getEmail();
        this.password = company.getPassword();
        this.cnpj = company.getCnpj();
        this.address = company.getAddress();
        this.companyDepartment = company.getCompanyDepartment();
        this.phone = company.getPhone();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public CompanyDepartment getCompanyDepartment() {
        return companyDepartment;
    }

    public void setCompanyDepartment(CompanyDepartment companyDepartment) {
        this.companyDepartment = companyDepartment;
    }

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + ", email=" + email + ", cnpj=" + cnpj + ", address=" + address + ", companyDepartment=" + companyDepartment + "]";
    }
}
