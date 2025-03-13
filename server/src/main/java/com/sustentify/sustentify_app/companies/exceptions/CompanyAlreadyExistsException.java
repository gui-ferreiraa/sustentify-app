package com.sustentify.sustentify_app.companies.exceptions;

import com.sustentify.sustentify_app.companies.entities.Company;

public class CompanyAlreadyExistsException extends RuntimeException {

    private final Company company;

    public CompanyAlreadyExistsException(Company company) {
        super("Company Already Exists: " + company.getName() + " (" + company.getEmail() + ")");
        this.company = company;
    }

    public CompanyAlreadyExistsException(String message, Company company) {
        super(message);
        this.company = company;
    }

    public Company getCompany() {
        return company;
    }
}
