package com.sustentify.sustentify_app.app.auth;

import com.sustentify.sustentify_app.app.auth.dtos.AuthResponseDto;
import com.sustentify.sustentify_app.app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.app.auth.dtos.RecoverDto;
import com.sustentify.sustentify_app.app.auth.dtos.RecoverPasswordDto;
import com.sustentify.sustentify_app.app.auth.jwt.TokenService;
import com.sustentify.sustentify_app.app.auth.jwt.exceptions.TokenValidationException;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyPasswordInvalidException;
import com.sustentify.sustentify_app.app.companies.services.CompaniesService;
import com.sustentify.sustentify_app.app.emails.EmailDto;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final CompaniesService companiesService;
    private final EmailsService emailsService;

    public AuthService(PasswordEncoder passwordEncoder, TokenService tokenService, CompaniesService companiesService, EmailsService emailsService) {
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.companiesService = companiesService;
        this.emailsService = emailsService;
    }

    public ResponseEntity<Company> companyLogged(String accessToken) {
        String subjectEmail = tokenService.validateToken(accessToken);

        Company company = this.companiesService.findByEmail(subjectEmail).orElseThrow(CompanyNotFoundException::new);

        return ResponseEntity.ok(company);
    }

    public ResponseEntity<AuthResponseDto> signin(LoginCompanyDto loginCompanyDto, HttpServletResponse response) {
        Company company = this.companiesService.findByEmail(loginCompanyDto.email()).orElseThrow(CompanyNotFoundException::new);

        if (!passwordEncoder.matches(loginCompanyDto.password(), company.getPassword())) throw new CompanyPasswordInvalidException();

        String accessToken = this.tokenService.generateAccessToken(company);
        String refreshToken = this.tokenService.generateRefreshToken(company);

        createCookieWithRefreshToken(refreshToken, response);

        return ResponseEntity.ok(new AuthResponseDto(company.getName(), company.getEmail(), accessToken));
    }

    public ResponseEntity<AuthResponseDto> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = request.getHeader("Authorization");
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.replace("Bearer ", "");
        } else {
            throw new TokenValidationException("Token is missing or invalid");
        }

        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            throw new TokenValidationException("Refresh token is missing or invalid");
        }

        String subjectRefreshToken = this.tokenService.validateToken(refreshToken);

        Company company = this.companiesService.findByEmail(subjectRefreshToken).orElseThrow(CompanyNotFoundException::new);

        var newAccessToken = this.tokenService.generateAccessToken(company);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new AuthResponseDto(company.getName(), company.getEmail(), newAccessToken));
    }

    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response, String accessToken) {
        tokenService.revokeToken(accessToken);

        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
//        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("successfully", "true", "message", "Logout Successfully"));
    }

    private void createCookieWithRefreshToken(String refreshToken, HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);

        response.addCookie(refreshTokenCookie);
    }

    public void sendEmailRecoverPassword(RecoverDto dto) {
        Company company = this.companiesService.findByEmail(dto.email()).orElseThrow(CompanyNotFoundException::new);

        String token = this.tokenService.generateAccessToken(company, 0, 1);

        EmailDto email = new EmailDto(company, "Recuperação de senha", token);
        this.emailsService.sendEmail(email);
    }

    public void updatePassword(RecoverPasswordDto dto, String token) {
        String email = this.tokenService.validateToken(token);

        Company company = this.companiesService.findByEmail(email).orElseThrow(CompanyNotFoundException::new);

        this.companiesService.updatePassword(company, dto.password());

        this.tokenService.revokeToken(token);
    }
}
