package com.sustentify.sustentify_app.app.companies.enums;

public enum Validation {
    PROGRESS("Progress"),
    CANCELLED("Cancelled"),
    ACCEPTED("Accepted");

    private final String name;

    Validation(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name;
    }
}
