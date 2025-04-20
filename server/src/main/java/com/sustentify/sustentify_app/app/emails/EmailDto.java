package com.sustentify.sustentify_app.app.emails;

import com.sustentify.sustentify_app.app.companies.entities.Company;

public record EmailDto(
        Company company,
        String subject,
        String token
) {
}
