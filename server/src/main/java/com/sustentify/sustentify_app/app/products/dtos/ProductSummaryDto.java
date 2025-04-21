package com.sustentify.sustentify_app.app.products.dtos;

import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.entities.ProductThumbnail;
import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;

public class ProductSummaryDto {
    private final String id;
    private final String name;
    private final Category category;
    private final Condition condition;
    private final int quantity;
    private final String location;
    private final int interestCount;
    private final ProductThumbnail thumbnail;

    public ProductSummaryDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.category = product.getCategory();
        this.quantity = product.getQuantity();
        this.location = product.getLocation();
        this.interestCount = product.getInterestCount();
        this.thumbnail = product.getThumbnail();
        this.condition = product.getCondition();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Category getCategory() {
        return category;
    }

    public Condition getCondition() { return condition;}

    public int getQuantity() {
        return quantity;
    }

    public String getLocation() {
        return location;
    }

    public int getInterestCount() {return interestCount;}

    public ProductThumbnail getThumbnail() {
        return thumbnail;
    }
}

