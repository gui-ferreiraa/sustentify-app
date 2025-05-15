package com.sustentify.sustentify_app.app.companies.dtos;

import com.sustentify.sustentify_app.app.companies.enums.Validation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ValidateCompanyDto(
        @NotNull(message = "Validation is required")
        @NotBlank(message = "Validation is not empty")
        Validation validation
) {
}
