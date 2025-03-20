package com.sustentify.sustentify_app.interestedProducts.exceptions;

public class InterestedProductsInvalidException extends RuntimeException {
    public InterestedProductsInvalidException() {
        super("Invalid Params");
    }

    public InterestedProductsInvalidException(String message) {
        super(message);
    }
}
