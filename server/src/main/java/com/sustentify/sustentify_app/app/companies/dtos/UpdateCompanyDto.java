package com.sustentify.sustentify_app.app.companies.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDepartment;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UpdateCompanyDto(
        String name,
        String address,
        CompanyDepartment companyDepartment
) {
}
