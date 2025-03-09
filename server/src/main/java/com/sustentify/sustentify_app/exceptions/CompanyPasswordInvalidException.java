package com.sustentify.sustentify_app.exceptions;

public class CompanyPasswordInvalidException extends RuntimeException {
    private final String companyEmail;

    public CompanyPasswordInvalidException(String companyEmail) {
        super("Company Password Invalid: (" + companyEmail+ ")");
        this.companyEmail = companyEmail;
    }

    public CompanyPasswordInvalidException(String message, String companyEmail) {
        super(message);
        this.companyEmail = companyEmail;
    }

    public String getCompanyEmail() {
        return companyEmail;
    }
}
