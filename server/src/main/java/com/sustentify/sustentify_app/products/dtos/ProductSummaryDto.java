package com.sustentify.sustentify_app.products.dtos;

import com.sustentify.sustentify_app.products.enums.Category;

public class ProductSummaryDto {
    private String name;
    private Category category;
    private Double price;
    private int quantity;
    private String location;

    // Construtor
    public ProductSummaryDto(String name, Category category, Double price, int quantity, String location) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.location = location;
    }

    // Getters e Setters
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
}

