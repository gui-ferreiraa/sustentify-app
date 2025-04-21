package com.sustentify.sustentify_app.app.companies.dtos;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDepartment;

public class CompanySummaryDto{
    private final String id;
    private final String name;
    private final String email;
    private final String address;
    private final String phone;
    private final CompanyDepartment companyDepartment;

    public CompanySummaryDto(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.email = company.getEmail();
        this.address = company.getAddress();
        this.phone = company.getPhone();
        this.companyDepartment = company.getCompanyDepartment();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public CompanyDepartment getCompanyDepartment() {
        return companyDepartment;
    }
}
