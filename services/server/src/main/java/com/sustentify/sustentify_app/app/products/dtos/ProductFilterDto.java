package com.sustentify.sustentify_app.app.products.dtos;

import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;
import com.sustentify.sustentify_app.app.products.enums.Material;
import com.sustentify.sustentify_app.types.FilterSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.Objects;

public class ProductFilterDto implements FilterSpecification<Product> {
    private Category category;
    private Condition condition;
    private Material material;

    public ProductFilterDto() {
    }

    public ProductFilterDto(Category category, Condition condition, Material material) {
        this.category = category;
        this.condition = condition;
        this.material = material;
    }

    public Category getCategory() {
        return category;
    }

    public Condition getCondition() {
        return condition;
    }

    public Material getMaterial() {
        return material;
    }

    @Override
    public Specification<Product> toSpecification() {
        Specification<Product> specification = Specification.where(null);

        if (Objects.nonNull(category)) {
            specification = specification.and(
                    (root, query, cb) -> cb.equal(root.get("category"), category)
            );
        }

        if (Objects.nonNull(condition)) {
            specification = specification.and(
                    (root, query, cb) -> cb.equal(root.get("condition"), condition)
            );
        }

        if (Objects.nonNull(material)) {
            specification = specification.and(
                    (root, query, cb) -> cb.equal(root.get("material"), material)
            );
        }

        return specification;
    }
}
