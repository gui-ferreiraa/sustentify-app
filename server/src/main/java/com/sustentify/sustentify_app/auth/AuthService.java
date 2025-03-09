package com.sustentify.sustentify_app.auth;

import com.sustentify.sustentify_app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.ResponseDto;
import com.sustentify.sustentify_app.companies.CompaniesRepository;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.jwt.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final CompaniesRepository companiesRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(CompaniesRepository companiesRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.companiesRepository = companiesRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public ResponseEntity<ResponseDto> login(LoginCompanyDto loginCompanyDto) {
        Company company = this.companiesRepository.findByEmail(loginCompanyDto.email()).orElseThrow(() -> new CompanyNotFoundException(loginCompanyDto));

        if (!passwordEncoder.matches(company.getPassword(), loginCompanyDto.password())) ResponseEntity.badRequest().body("Invalid Credentials");

        String accessToken = this.tokenService.generateAccessToken(company);
        String refreshToken = this.tokenService.generateRefreshToken(company);

        return ResponseEntity.ok(new ResponseDto(company.getName(), company.getEmail(), accessToken));
    }

    public ResponseEntity<ResponseDto> register(RegisterCompanyDto registerCompanyDto) {
        Optional<Company> company = this.companiesRepository.findByEmail(registerCompanyDto.email());

        if (company.isPresent()) {
            throw new CompanyAlreadyExistsException(company.get());
        }

        Company newCompany = new Company();
        newCompany.setPassword(passwordEncoder.encode(registerCompanyDto.password()));
        newCompany.setEmail(registerCompanyDto.email());
        newCompany.setName(registerCompanyDto.name());
        newCompany.setAddress(registerCompanyDto.address());
        newCompany.setCompanyDepartment(registerCompanyDto.companyDepartment());
        newCompany.setCnpj(registerCompanyDto.cnpj());
        this.companiesRepository.save(newCompany);

        String accessToken = this.tokenService.generateAccessToken(newCompany);
        String refreshToken = this.tokenService.generateRefreshToken(newCompany);

        return ResponseEntity.ok(new ResponseDto(newCompany.getName(), newCompany.getEmail(), accessToken));
    }
}
