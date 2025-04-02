package com.sustentify.sustentify_app.app.products.exceptions;

public class ProductInvalidException extends RuntimeException {
    private String field;

    public ProductInvalidException() {
        super("Product Invalid");
    }

    public ProductInvalidException(String field) {
        super("Field Invalid: ( " + field + " )");
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
