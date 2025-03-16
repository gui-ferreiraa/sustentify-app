package com.sustentify.sustentify_app.products.dtos;

import com.sustentify.sustentify_app.products.enums.Category;
import com.sustentify.sustentify_app.products.enums.Condition;
import com.sustentify.sustentify_app.products.enums.Material;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public record RegisterProductDto(
        @NotNull(message = "Name is required")
        @NotBlank(message = "- field Name is not empty")
        String name,
        @NotNull(message = "Category is required")
        Category category,
        @NotNull(message = "Description is required")
        @NotBlank(message = "- field Description is not empty")
        String description,
        @NotNull(message = "Condition is required")
        Condition condition,
        @NotNull(message = "Material is required")
        Material material,
        @NotNull(message = "Production date is required")
        Instant productionDate,
        @NotNull(message = "Price is required")
        @Positive(message = "- field Price must be positive")
        Double price,
        @NotBlank(message = "Location cannot be empty")
        @NotNull(message = "Location is required")
        String location,
        @Min(value = 1, message = "- field Quantity must be greater than or equal to 1")
        int quantity
) {
}
