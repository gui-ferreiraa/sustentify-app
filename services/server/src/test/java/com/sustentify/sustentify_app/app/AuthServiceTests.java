package com.sustentify.sustentify_app.app;

import com.sustentify.sustentify_app.app.auth.AuthService;
import com.sustentify.sustentify_app.app.auth.dtos.RecoverPasswordDto;
import com.sustentify.sustentify_app.app.auth.jwt.TokenService;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.app.companies.services.CompaniesService;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

public class AuthServiceTests {

    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private TokenService tokenService;
    @Mock
    private CompaniesService companiesService;
    @Mock
    private EmailsService emailsService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should companyLogged is Succesfully")
    public void companyLoggedCase1() {
        String token = "token";
        String email = "test@test.com";

        Mockito.when(tokenService.validateToken(Mockito.anyString())).thenReturn(email);
        Mockito.when(companiesService.findByEmail(email)).thenReturn(Optional.ofNullable(Mockito.mock(Company.class)));

        authService.companyLogged(token);

        Mockito.verify(companiesService, Mockito.times(1)).findByEmail(email);
        Mockito.verify(tokenService, Mockito.times(1)).validateToken(token);
    }

    @Test
    @DisplayName("Should companyLogged throws CompanyNotFoundException")
    public void companyLoggedCase2() {
        String token = "token";
        String email = "test@test.com";

        Mockito.when(tokenService.validateToken(Mockito.anyString())).thenReturn(email);
        Mockito.when(companiesService.findByEmail(email)).thenReturn(Optional.empty());

        Assertions.assertThrows(CompanyNotFoundException.class, () -> authService.companyLogged(token));
    }

    @Test
    @DisplayName("Should updatePassword throws CompanyNotFoundException")
    public void updatePasswordCase1() {
        RecoverPasswordDto dto = new RecoverPasswordDto("password");
        String token = "token";
        String email = "test@test.com";

        Mockito.when(tokenService.validateToken(Mockito.anyString())).thenReturn(email);
        Mockito.when(companiesService.findByEmail(email)).thenReturn(Optional.empty());

        Assertions.assertThrows(CompanyNotFoundException.class, () -> authService.updatePassword(dto, token));
    }

    @Test
    @DisplayName("Should updatePassword is Successfully")
    public void updatePasswordCase2() {
        RecoverPasswordDto dto = new RecoverPasswordDto("password");
        String token = "token";
        String email = "test@test.com";

        Mockito.when(tokenService.validateToken(Mockito.anyString())).thenReturn(email);
        Mockito.when(companiesService.findByEmail(email)).thenReturn(Optional.ofNullable(Mockito.mock(Company.class)));

        authService.updatePassword(dto, token);

        Mockito.verify(companiesService, Mockito.times(1)).findByEmail(email);
        Mockito.verify(tokenService, Mockito.times(1)).validateToken(token);
        Mockito.verify(tokenService, Mockito.times(1)).revokeToken(token);
    }
}
