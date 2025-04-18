package com.sustentify.sustentify_app.app.emails;

public record EmailDto(
        String name,
        String email,
        String subject,
        String recoveryLink
) {
}
