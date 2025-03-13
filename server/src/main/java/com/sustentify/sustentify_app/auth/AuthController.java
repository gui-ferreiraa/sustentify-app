package com.sustentify.sustentify_app.auth;

import com.sustentify.sustentify_app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.ResponseDto;
import com.sustentify.sustentify_app.companies.entities.Company;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping()
    @Cacheable("companyLogged")
    public ResponseEntity<Company> companyLogged(@RequestHeader("Authorization") String tokenAuthorization) {
        String accessToken = tokenAuthorization.replace("Bearer ", "");

        return this.authService.companyLogged(accessToken);
    }

    @PostMapping("/signin")
    public ResponseEntity<ResponseDto> signin(@RequestBody LoginCompanyDto loginCompanyDto, HttpServletResponse response) {
        return this.authService.signin(loginCompanyDto, response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(@RequestBody RegisterCompanyDto registerCompanyDto, HttpServletResponse response) {
        return this.authService.signup(registerCompanyDto, response);
    }

    @GetMapping("/logout")
    @CacheEvict("companyLogged")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        return this.authService.logout(response);
    }
}
