package com.sustentify.sustentify_app.app.interestedProducts.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.app.products.entities.Product;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "interested_products")
public class InterestedProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "companies_id", nullable = false)
    @JsonIgnore
    private Company buyer;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InterestStatus status;

    private int quantity;

    @UpdateTimestamp
    private Instant updatedAt;

    @CreationTimestamp
    private Instant createdAt;

    public InterestedProducts() {
    }

    public InterestedProducts(Company buyer, Product product, InterestStatus status, int quantity) {
        this.buyer = buyer;
        this.product = product;
        this.status = status;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getBuyer() {
        return buyer;
    }

    public void setBuyer(Company company) {
        this.buyer = company;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public InterestStatus getStatus() {
        return status;
    }

    public void setStatus(InterestStatus status) {
        this.status = status;
    }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return product != null ? product.getPrice() : 0.0; }

    public Double getTotalPrice() { return quantity * getUnitPrice(); }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
