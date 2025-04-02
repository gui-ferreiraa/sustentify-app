package com.sustentify.sustentify_app.app.products.exceptions;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException() {
        super("Product Not Found");
    }

    public ProductNotFoundException(String message) {
        super(message);
    }
}
