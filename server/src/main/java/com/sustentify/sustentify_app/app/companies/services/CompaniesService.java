package com.sustentify.sustentify_app.app.companies.services;

import com.sustentify.sustentify_app.app.companies.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.UpdateCompanyDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDeleted;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesDeletedRepository;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesRepository;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
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

    public Optional<Company> findById(Long companyId) { return this.companiesRepository.findById(companyId); }

    public ResponseEntity<ResponseDto> create(RegisterCompanyDto registerCompanyDto) {
        this.findByEmail(registerCompanyDto.email()).ifPresent(existingCompany -> {
            throw new CompanyAlreadyExistsException();
        });

        Company newCompany = new Company();
        newCompany.setPassword(passwordEncoder.encode(registerCompanyDto.password()));
        newCompany.setEmail(registerCompanyDto.email());
        newCompany.setName(registerCompanyDto.name());
        newCompany.setAddress(registerCompanyDto.address());
        newCompany.setCompanyDepartment(registerCompanyDto.companyDepartment());
        newCompany.setCnpj(registerCompanyDto.cnpj());
        this.companiesRepository.save(newCompany);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDto(HttpStatus.CREATED, "Company Created", true, Optional.ofNullable(newCompany.getName())));
    }

    public ResponseEntity<ResponseDto> update(Long id, UpdateCompanyDto updateCompanyDto) {
        Company company = this.companiesRepository.findById(id).orElseThrow(CompanyNotFoundException::new);

        updateFields(company, updateCompanyDto);

        this.companiesRepository.save(company);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(HttpStatus.OK, "Company Updated", true, Optional.ofNullable(company.getName())));
    }

    public ResponseEntity<ResponseDto> delete(Company company) {
        CompanyDeleted companyDeleted = new CompanyDeleted(company);
        this.companiesDeletedRepository.save(companyDeleted);

        this.companiesRepository.delete(company);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(HttpStatus.OK, "Company Deleted", true, Optional.ofNullable(company.getName())));
    }

    private void updateFields(Company company, UpdateCompanyDto updateCompanyDto) {
        Field[] fields = updateCompanyDto.getClass().getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object value = field.get(updateCompanyDto);
                if (value != null) {
                    Field companyField = company.getClass().getDeclaredField(field.getName());
                    companyField.setAccessible(true);
                    companyField.set(company, value);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
