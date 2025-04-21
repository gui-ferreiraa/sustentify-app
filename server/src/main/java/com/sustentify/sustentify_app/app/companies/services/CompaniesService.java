package com.sustentify.sustentify_app.app.companies.services;

import com.sustentify.sustentify_app.app.companies.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.UpdateCompanyDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDeleted;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesDeletedRepository;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CompaniesService {
    private final CompaniesRepository companiesRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompaniesDeletedRepository companiesDeletedRepository;

    public CompaniesService(CompaniesRepository companiesRepository, PasswordEncoder passwordEncoder, CompaniesDeletedRepository companiesDeletedRepository) {
        this.companiesRepository = companiesRepository;
        this.passwordEncoder = passwordEncoder;
        this.companiesDeletedRepository = companiesDeletedRepository;
    }

    public Optional<Company> findByEmail(String email) {
        return this.companiesRepository.findByEmail(email);
    }

    public boolean isEmailOrCnpjAlreadyRegistered(String email, String cnpj) {
        return companiesRepository.findByEmail(email).isPresent()
                || companiesRepository.findByCnpj(cnpj).isPresent();
    }

    public Optional<Company> findById(String companyId) { return this.companiesRepository.findById(companyId); }

    @Transactional
    public Company create(RegisterCompanyDto registerCompanyDto) {

        boolean exists = isEmailOrCnpjAlreadyRegistered(registerCompanyDto.email(), registerCompanyDto.cnpj());
        if (exists) throw new CompanyAlreadyExistsException();

        Company newCompany = new Company();
        newCompany.setPassword(passwordEncoder.encode(registerCompanyDto.password()));
        newCompany.setEmail(registerCompanyDto.email());
        newCompany.setName(registerCompanyDto.name());
        newCompany.setAddress(registerCompanyDto.address());
        newCompany.setCompanyDepartment(registerCompanyDto.companyDepartment());
        newCompany.setCnpj(registerCompanyDto.cnpj());
        newCompany.setPhone(registerCompanyDto.phone());

        return this.companiesRepository.save(newCompany);
    }

    @Transactional
    public Company update(Company company, UpdateCompanyDto updateCompanyDto) {

        applyUpdates(company, updateCompanyDto);

        return this.companiesRepository.save(company);
    }

    @Transactional
    public void updatePassword(Company company, String password) {
        String hashedPassword = this.passwordEncoder.encode(password);

        company.setPassword(hashedPassword);

        this.companiesRepository.save(company);
    }

    @Transactional
    public void delete(Company company) {
        CompanyDeleted companyDeleted = new CompanyDeleted(company);
        this.companiesDeletedRepository.save(companyDeleted);

        this.companiesRepository.delete(company);
    }

    private void applyUpdates(Company company, UpdateCompanyDto dto) {
        if (dto.name() != null) company.setName(dto.name());
        if (dto.address() != null) company.setAddress(dto.address());
        if (dto.companyDepartment() != null) company.setCompanyDepartment(dto.companyDepartment());
        if (dto.phone() != null) company.setPhone(dto.phone());
    }
}
