package com.sustentify.sustentify_app.app.companies.enums;

public enum Validation {
    PROGRESS("progress"),
    CANCELLED("cancelled"),
    ACCEPTED("accepted");

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
