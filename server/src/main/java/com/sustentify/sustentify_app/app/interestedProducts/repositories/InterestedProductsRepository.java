package com.sustentify.sustentify_app.app.interestedProducts.repositories;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.products.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterestedProductsRepository extends JpaRepository<InterestedProducts, Long> {
    List<InterestedProducts> findByBuyer(Company buyer);
    Optional<InterestedProducts> findByBuyerAndProduct(Company buyer, Product product);
    List<InterestedProducts> findByProduct(Product product);

}
