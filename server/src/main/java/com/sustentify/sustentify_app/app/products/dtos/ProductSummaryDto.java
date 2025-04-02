package com.sustentify.sustentify_app.app.products.dtos;

import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.enums.Category;

public class ProductSummaryDto {
    private Long id;
    private String name;
    private Category category;
    private Double price;
    private int quantity;
    private String location;
    private int interestCount;

    public ProductSummaryDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.location = product.getLocation();
        this.interestCount = product.getInterestCount();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getInterestCount() {return interestCount;}

    public void setInterestCount(int interestCount) {this.interestCount = interestCount;}
}

