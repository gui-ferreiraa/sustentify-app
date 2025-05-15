package com.sustentify.sustentify_app.app.companies.exceptions;

import com.sustentify.sustentify_app.app.companies.enums.Validation;
import org.springframework.http.HttpStatus;

public class CompanyValidationException extends RuntimeException {
    private HttpStatus status;

    public CompanyValidationException() {
        super("Company Validation");
    }

    public CompanyValidationException(String message, Validation validation, HttpStatus status) {
        super("Validation: " + validation + ": " + message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
