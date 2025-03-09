package com.sustentify.sustentify_app.auth.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sustentify.sustentify_app.companies.entities.CompanyDepartment;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
public record RegisterCompanyDto(
        String name,
        String email,
        String password,
        String cnpj,
        String address,
        CompanyDepartment companyDepartment
) {
}
