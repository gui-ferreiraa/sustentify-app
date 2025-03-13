package com.sustentify.sustentify_app.products.dtos;

import com.sustentify.sustentify_app.products.enums.Category;
import com.sustentify.sustentify_app.products.enums.Condition;
import com.sustentify.sustentify_app.products.enums.Material;

import java.time.Instant;

public record RegisterProductDto(
        String name,
        Category category,
        String description,
        Condition condition,
        Material material,
        Instant productionDate,
        Instant disposalDate,
        Double price,
        String location,
        int quantity
) {
}
