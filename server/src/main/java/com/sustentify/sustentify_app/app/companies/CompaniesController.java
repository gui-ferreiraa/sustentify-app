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

import java.util.Optional;

@RestController
@RequestMapping("/v1/companies")
public class CompaniesController {
    private final CompaniesService companiesService;

    public CompaniesController(CompaniesService companiesService) {
        this.companiesService = companiesService;
    }

    @PostMapping
    public ResponseEntity<ResponseDto> create(@RequestBody RegisterCompanyDto company) {
        Company companyCreated = this.companiesService.create(company);
        ResponseDto res = new ResponseDto(HttpStatus.CREATED, "Company created", true, Optional.empty());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(res);
    }

    @PatchMapping()
    public ResponseEntity<ResponseDto> update(@RequestBody UpdateCompanyDto updateCompanyDto) {
        Company company = SecurityUtils.getCurrentCompany();

        this.companiesService.update(company, updateCompanyDto);

        ResponseDto res = new ResponseDto(HttpStatus.OK, "Company updated", true, Optional.empty());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
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

        this.companiesService.delete(company);
        ResponseDto res = new ResponseDto(HttpStatus.OK, "Company deleted", true, Optional.empty());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
    }
}
