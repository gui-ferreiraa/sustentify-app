package com.sustentify.sustentify_app.companies;

import com.sustentify.sustentify_app.companies.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompaniesRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByEmail(String email);
}
