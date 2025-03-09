package com.sustentify.sustentify_app.companies.entity;

import jakarta.persistence.*;

@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String cnpj;

    private String address;

    @Enumerated(EnumType.STRING)
    private CompanyDepartment companyDepartment;

    public Company() {
    }

    public Company(String name, String email, String password, String cnpj, String address, CompanyDepartment companyDepartment) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.cnpj = cnpj;
        this.address = address;
        this.companyDepartment = companyDepartment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + ", email=" + email + ", cnpj=" + cnpj + ", address=" + address + ", companyDepartment=" + companyDepartment + "]";
    }
}
