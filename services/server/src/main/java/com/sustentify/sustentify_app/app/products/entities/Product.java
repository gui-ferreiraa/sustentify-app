package com.sustentify.sustentify_app.app.products.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;
import com.sustentify.sustentify_app.app.products.enums.Material;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<InterestedProducts> interestedProducts = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProductThumbnail thumbnail;


    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    public Product() {
    }

    public Product(String name, Category category, String description, Condition condition, Material material, Instant productionDate, Instant disposalDate, Double price, String location, int quantity, Company company) {
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
    public String getCompanyId() {
        return company != null ? company.getId() : null;
    }

    public int getInterestCount() {return interestedProducts.size();}

    public ProductThumbnail getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(ProductThumbnail thumbnail) {
        this.thumbnail = thumbnail;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void addImage(ProductImage image) {
        this.images.add(image);
    }
}
