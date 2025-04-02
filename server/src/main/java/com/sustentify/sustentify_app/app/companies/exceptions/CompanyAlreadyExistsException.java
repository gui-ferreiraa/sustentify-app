package com.sustentify.sustentify_app.app.companies.exceptions;

public class CompanyAlreadyExistsException extends RuntimeException {

    public CompanyAlreadyExistsException() {
        super("Company Already Exists ");
    }

    public CompanyAlreadyExistsException(String message) {
        super(message);
    }
}
