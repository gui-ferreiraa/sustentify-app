package com.sustentify.sustentify_app.types;

import org.springframework.data.jpa.domain.Specification;

public interface FilterSpecification<T> {
    public Specification<T> toSpecification();
}
