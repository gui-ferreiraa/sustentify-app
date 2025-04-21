package com.sustentify.sustentify_app.app.companies.repositories;

import com.sustentify.sustentify_app.app.companies.entities.CompanyDeleted;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CompaniesDeletedRepository extends JpaRepository<CompanyDeleted, UUID> {
}
