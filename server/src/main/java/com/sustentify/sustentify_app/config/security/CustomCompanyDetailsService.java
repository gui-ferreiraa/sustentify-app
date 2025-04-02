package com.sustentify.sustentify_app.config.security;

import com.sustentify.sustentify_app.app.companies.repositories.CompaniesRepository;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class CustomCompanyDetailsService implements UserDetailsService {
    private final CompaniesRepository companiesRepository;

    public CustomCompanyDetailsService(CompaniesRepository companiesRepository) {
        this.companiesRepository = companiesRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Company company = this.companiesRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return new org.springframework.security.core.userdetails.User(company.getName(), company.getPassword(), new ArrayList<>());
    }
}
