package com.sustentify.sustentify_app.app.emails;

public enum EmailTemplate {
    CONTACT("contact-message.html"),
    RECOVER_PASSWORD("recover-password.html"),
    VALIDATION_COMPANY("validation-company.html");

    private final String name;

    EmailTemplate(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
