package com.sustentify.sustentify_app.app.products.dtos;

import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;
import com.sustentify.sustentify_app.app.products.enums.Material;

public record UpdateProductDto(
        String name,
        Category category,
        String description,
        Condition condition,
        Material material,
        Double price,
        String location,
        Integer quantity
) {
}
