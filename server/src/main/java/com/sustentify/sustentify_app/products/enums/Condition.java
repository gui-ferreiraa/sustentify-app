package com.sustentify.sustentify_app.products.enums;

public enum Condition {
    NEW("New"),
    USED("Used"),
    REFURBISHED("Refurbished"),
    DAMAGED("Damaged"),
    EXPIRED("Expired"),
    AVAILABLE("Available");

    private final String displayName;

    Condition(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
