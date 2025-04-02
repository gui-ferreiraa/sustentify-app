package com.sustentify.sustentify_app.app.companies;

import com.sustentify.sustentify_app.app.companies.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.UpdateCompanyDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.app.companies.services.CompaniesService;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/companies")
public class CompaniesController {
    private final CompaniesService companiesService;

    public CompaniesController(CompaniesService companiesService) {
        this.companiesService = companiesService;
    }

    @PostMapping
    public ResponseEntity<ResponseDto> create(@RequestBody RegisterCompanyDto company) {
        return this.companiesService.create(company);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDto> update(@PathVariable Long id, @RequestBody UpdateCompanyDto updateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> findById(@PathVariable Long id) {
        Company company = this.companiesService.findById(id).orElseThrow(CompanyNotFoundException::new);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(company);
    }

    @DeleteMapping()
    public ResponseEntity<ResponseDto> delete() {
        Company company = SecurityUtils.getCurrentCompany();

        return this.companiesService.delete(company);
    }
}
