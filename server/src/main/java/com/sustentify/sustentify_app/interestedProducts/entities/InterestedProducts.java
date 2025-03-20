package com.sustentify.sustentify_app.interestedProducts.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.products.entities.Product;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "interested_products")
public class InterestedProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "companies_id", nullable = false)
    @JsonIgnore
    private Company company;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InterestStatus status;

    @UpdateTimestamp
    private Instant updatedAt;

    @CreationTimestamp
    private Instant createdAt;

    public InterestedProducts() {
    }

    public InterestedProducts(Company company, Product product, InterestStatus status) {
        this.company = company;
        this.product = product;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Long getProduct() {
        return product.getId();
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
