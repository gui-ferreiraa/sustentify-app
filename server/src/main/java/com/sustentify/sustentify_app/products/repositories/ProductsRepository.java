package com.sustentify.sustentify_app.products.repositories;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.products.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Long> {
    List<Product> findByCompany(Company company);
    Optional<Product> findById(Long id);
}
