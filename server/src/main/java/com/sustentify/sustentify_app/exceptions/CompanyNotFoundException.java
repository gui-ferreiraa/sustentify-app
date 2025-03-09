package com.sustentify.sustentify_app.exceptions;

import com.sustentify.sustentify_app.auth.dtos.LoginCompanyDto;

public class CompanyNotFoundException extends RuntimeException {

    private final LoginCompanyDto company;

    public CompanyNotFoundException(LoginCompanyDto company) {
        super("Company Not Found: (" + company.email() + ")");
        this.company = company;
    }

    public CompanyNotFoundException(String message, LoginCompanyDto company) {
        super(message);
        this.company = company;
    }

    public LoginCompanyDto getCompany() {
        return company;
    }
}
