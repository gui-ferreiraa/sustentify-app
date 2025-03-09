package com.sustentify.sustentify_app.companies;

import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.companies.entities.Company;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CompaniesService {
    private final CompaniesRepository companiesRepository;
    private final PasswordEncoder passwordEncoder;

    public CompaniesService(CompaniesRepository companiesRepository, PasswordEncoder passwordEncoder) {
        this.companiesRepository = companiesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Company> findByEmail(String email) {
        return this.companiesRepository.findByEmail(email);
    }

    public Company create(RegisterCompanyDto registerCompanyDto) {
        Company newCompany = new Company();
        newCompany.setPassword(passwordEncoder.encode(registerCompanyDto.password()));
        newCompany.setEmail(registerCompanyDto.email());
        newCompany.setName(registerCompanyDto.name());
        newCompany.setAddress(registerCompanyDto.address());
        newCompany.setCompanyDepartment(registerCompanyDto.companyDepartment());
        newCompany.setCnpj(registerCompanyDto.cnpj());
        this.companiesRepository.save(newCompany);

        return newCompany;
    }
}
