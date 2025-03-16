package com.sustentify.sustentify_app.companies.exceptions;

public class CompanyPasswordInvalidException extends RuntimeException {
    public CompanyPasswordInvalidException() {
        super("Company Password Invalid ");
    }

    public CompanyPasswordInvalidException(String message) {
        super(message);
    }
}
