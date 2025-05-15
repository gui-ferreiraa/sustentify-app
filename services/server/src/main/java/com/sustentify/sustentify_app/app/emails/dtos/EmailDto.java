package com.sustentify.sustentify_app.app.emails.dtos;

public record EmailDto(
        String name,
        String email,
        String phone,
        String subject,
        String message
) {
}
