package com.sustentify.sustentify_app.products.exceptions;

public class ProductAlreadyExistsException extends RuntimeException {
    public ProductAlreadyExistsException() {
        super("Product Already Exists");
    }

    public ProductAlreadyExistsException(String message) {
        super(message);
    }
}
