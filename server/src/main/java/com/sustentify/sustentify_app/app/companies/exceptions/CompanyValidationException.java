package com.sustentify.sustentify_app.app.companies.exceptions;

import com.sustentify.sustentify_app.app.companies.enums.Validation;

public class CompanyValidationException extends RuntimeException {
    public CompanyValidationException() {
        super("Company Validation");
    }

    public CompanyValidationException(String message, Validation validation) {
        super("Validation: " + validation + ": " + message);
    }
}
