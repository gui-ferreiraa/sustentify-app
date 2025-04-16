package com.sustentify.sustentify_app.app.interestedProducts.dtos;

import com.sustentify.sustentify_app.app.companies.dtos.CompanySummaryDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.products.dtos.ProductSummaryDto;
import com.sustentify.sustentify_app.app.products.entities.Product;

import java.time.Instant;

public class InterestedProductsDto {
    private Long id;
    private Company buyer;
    private Product product;
    private InterestStatus status;
    private int quantity;
    private String message;
    private Instant updatedAt;
    private Instant createdAt;

    public InterestedProductsDto(InterestedProducts interestedProducts) {
        this.id = interestedProducts.getId();
        this.buyer = interestedProducts.getBuyer();
        this.product = interestedProducts.getProduct();
        this.status = interestedProducts.getStatus();
        this.quantity = interestedProducts.getQuantity();
        this.message = interestedProducts.getMessage();
        this.updatedAt = interestedProducts.getUpdatedAt();
        this.createdAt = interestedProducts.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public CompanySummaryDto getBuyer() {
        return new CompanySummaryDto(buyer);
    }

    public ProductSummaryDto getProduct() {
        return new ProductSummaryDto(product);
    }

    public InterestStatus getStatus() {
        return status;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getMessage() {
        return message;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Double getUnitPrice() { return product != null ? product.getPrice() : 0.0; }

    public Double getTotalPrice() { return quantity * getUnitPrice(); }
}
