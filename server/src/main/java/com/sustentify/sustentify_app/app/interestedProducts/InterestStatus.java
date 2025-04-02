package com.sustentify.sustentify_app.app.interestedProducts;

public enum InterestStatus {
    PENDING("pending"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String name;

    InterestStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
