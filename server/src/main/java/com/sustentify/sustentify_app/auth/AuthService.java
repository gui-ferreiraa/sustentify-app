package com.sustentify.sustentify_app.auth;

import com.sustentify.sustentify_app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.ResponseDto;
import com.sustentify.sustentify_app.companies.CompaniesService;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.exceptions.CompanyPasswordInvalidException;
import com.sustentify.sustentify_app.jwt.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final CompaniesService companiesService;

    public AuthService(PasswordEncoder passwordEncoder, TokenService tokenService, CompaniesService companiesService) {
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.companiesService = companiesService;
    }

    public ResponseEntity<ResponseDto> login(LoginCompanyDto loginCompanyDto) {
        Company company = this.companiesService.findByEmail(loginCompanyDto.email()).orElseThrow(() -> new CompanyNotFoundException(loginCompanyDto.email()));

        if (!passwordEncoder.matches(company.getPassword(), loginCompanyDto.password())) throw new CompanyPasswordInvalidException(loginCompanyDto.email());

        String accessToken = this.tokenService.generateAccessToken(company);
        String refreshToken = this.tokenService.generateRefreshToken(company);

        return ResponseEntity.ok(new ResponseDto(company.getName(), company.getEmail(), accessToken));
    }

    public ResponseEntity<ResponseDto> register(RegisterCompanyDto registerCompanyDto) {
        this.companiesService.findByEmail(registerCompanyDto.email())
                .ifPresent(existingCompany -> {
                    throw new CompanyAlreadyExistsException(existingCompany);
                });

        Company newCompany = companiesService.create(registerCompanyDto);

        String accessToken = this.tokenService.generateAccessToken(newCompany);
        String refreshToken = this.tokenService.generateRefreshToken(newCompany);

        return ResponseEntity.ok(new ResponseDto(newCompany.getName(), newCompany.getEmail(), accessToken));
    }

    private void createCookieWithRefreshToken(String cookie HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", cookie);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);

        response.addCookie(refreshTokenCookie);
    }
}
