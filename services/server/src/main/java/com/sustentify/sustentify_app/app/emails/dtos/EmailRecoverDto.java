package com.sustentify.sustentify_app.app.emails.dtos;

import com.sustentify.sustentify_app.app.companies.entities.Company;

public record EmailRecoverDto(
        Company company,
        String subject,
        String token
) {
}
