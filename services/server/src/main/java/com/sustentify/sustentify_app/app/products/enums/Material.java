package com.sustentify.sustentify_app.app.products.enums;

public enum Material {
    PLASTIC("Plastic"),
    METAL("Metal"),
    GLASS("Glass"),
    WOOD("Wood"),
    PAPER("Paper"),
    RUBBER("Rubber"),
    FABRIC("Fabric"),
    CERAMIC("Ceramic"),
    COMPOSITE("Composite"),
    OTHER("Other");

    private final String name;

    Material(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
