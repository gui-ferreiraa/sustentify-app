package com.sustentify.sustentify_app.products.repositories;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.products.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Long>  {
    Page<Product> findByCompany(Company company, Pageable pageable);
    Optional<Product> findByIdAndCompany(Long id, Company company);
}
