package com.sustentify.sustentify_app.interestedProducts.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.products.entities.Product;
import jakarta.persistence.*;

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
    @JsonIgnore
    private Product product;

    @Column(name = "interest_date", nullable = false)
    private Instant interestDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InterestStatus status;

    public InterestedProducts() {
    }

    public InterestedProducts(Company company, Product product, Instant interestDate, InterestStatus status) {
        this.company = company;
        this.product = product;
        this.interestDate = interestDate;
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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Instant getInterestDate() {
        return interestDate;
    }

    public void setInterestDate(Instant interestDate) {
        this.interestDate = interestDate;
    }

    public InterestStatus getStatus() {
        return status;
    }

    public void setStatus(InterestStatus status) {
        this.status = status;
    }
}
