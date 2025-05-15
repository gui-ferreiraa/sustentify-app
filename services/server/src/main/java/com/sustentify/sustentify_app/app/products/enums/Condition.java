package com.sustentify.sustentify_app.app.products.enums;

public enum Condition {
    NEW("New"),
    USED("Used"),
    REFURBISHED("Refurbished"),
    DAMAGED("Damaged"),
    EXPIRED("Expired"),
    AVAILABLE("Available");

    private final String name;

    Condition(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
