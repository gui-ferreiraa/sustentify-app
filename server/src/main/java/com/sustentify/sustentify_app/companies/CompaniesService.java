package com.sustentify.sustentify_app.companies;

import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import org.springframework.stereotype.Service;

@Service
public class CompaniesService {
    private CompaniesRepository companiesRepository;

    public CompaniesService(CompaniesRepository companiesRepository) {
        this.companiesRepository = companiesRepository;
    }

    public Long create(RegisterCompanyDto registerCompanyDto) {


        return Long.compress(20, 2222222);
    }
}
