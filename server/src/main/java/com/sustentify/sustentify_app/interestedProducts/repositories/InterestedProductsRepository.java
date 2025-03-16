package com.sustentify.sustentify_app.interestedProducts.repositories;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.products.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestedProductsRepository extends JpaRepository<InterestedProducts, Long> {
    List<InterestedProducts> findByCompany(Company company);
    InterestedProducts findByCompanyAndProduct(Company company, Product product);

}
