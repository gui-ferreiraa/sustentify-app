package com.sustentify.sustentify_app.app.products.repositories;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByCompany(Company company, Pageable pageable);
    Optional<Product> findByIdAndCompany(Long id, Company company);
    @Query("SELECT p FROM Product p LEFT JOIN p.interestedProducts ip " +
            "GROUP BY p.id ORDER BY COUNT(ip.id) DESC")
    Page<Product> findTopByInterestCount(Pageable pageable);
}
