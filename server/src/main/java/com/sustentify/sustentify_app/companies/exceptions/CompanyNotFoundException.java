package com.sustentify.sustentify_app.companies.exceptions;

public class CompanyNotFoundException extends RuntimeException {

    private final String companyEmail;

    public CompanyNotFoundException(String companyEmail) {
        super("Company Not Found: (" + companyEmail+ ")");
        this.companyEmail = companyEmail;
    }

    public CompanyNotFoundException(String message, String companyEmail) {
        super(message);
        this.companyEmail = companyEmail;
    }

    public String getCompanyEmail() {
        return companyEmail;
    }
}
