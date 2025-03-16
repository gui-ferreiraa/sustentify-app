package com.sustentify.sustentify_app.products.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.products.enums.Category;
import com.sustentify.sustentify_app.products.enums.Condition;
import com.sustentify.sustentify_app.products.enums.Material;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Name cannot be null")
    @NotBlank(message = "Name cannot be empty")
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category cannot be null")
    private Category category;

    @NotNull(message = "description cannot be null")
    @NotBlank(message = "description cannot be empty")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition")
    @NotNull(message = "Condition cannot be null")
    private Condition condition;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Material cannot be null")
    private Material material;

    @NotNull(message = "Production date cannot be null")
    private Instant productionDate;

    @NotNull(message = "Disposal date cannot be null")
    private Instant disposalDate;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotNull(message = "Location cannot be null")
    @NotBlank(message = "Location cannot be empty")
    private String location;

    @Min(value = 1, message = "Quantity must be greater than or equal to 1")
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "companies_id")
    @JsonIgnore
    private Company company;

    public Product() {
    }

    public Product(Long id, String name, Category category, String description, Condition condition, Material material, Instant productionDate, Instant disposalDate, Double price, String location, int quantity, Company company) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.condition = condition;
        this.material = material;
        this.productionDate = productionDate;
        this.disposalDate = disposalDate;
        this.price = price;
        this.location = location;
        this.quantity = quantity;
        this.company = company;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public Instant getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(Instant productionDate) {
        this.productionDate = productionDate;
    }

    public Instant getDisposalDate() {
        return disposalDate;
    }

    public void setDisposalDate(Instant disposalDate) {
        this.disposalDate = disposalDate;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    @JsonProperty("company_id")
    public Long getCompanyId() {
        return company != null ? company.getId() : null;
    }
}
