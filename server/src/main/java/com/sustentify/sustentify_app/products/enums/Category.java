package com.sustentify.sustentify_app.products.enums;

public enum Category {
    ELECTRONIC("Electronic"),
    PLASTIC("Plastic"),
    METAL("Metal"),
    TEXTILE("Textile"),
    WOOD("Wood"),
    GLASS("Glass"),
    FOOD("Food"),
    CHEMICAL("Chemical");

    private final String name;

    Category(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
