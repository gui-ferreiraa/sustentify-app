package com.sustentify.sustentify_app.app.auth;

import com.sustentify.sustentify_app.app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.app.auth.dtos.ResponseDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<Company> companyLogged(@RequestHeader("Authorization") String tokenAuthorization) {
        String accessToken = tokenAuthorization.replace("Bearer ", "");

        return this.authService.companyLogged(accessToken);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody LoginCompanyDto loginCompanyDto, HttpServletResponse response) {
        return this.authService.signin(loginCompanyDto, response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<ResponseDto> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return this.authService.refreshToken(request, response);
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletResponse response,
            @RequestHeader("Authorization") String tokenAuthorization
            ) {
        String accessToken = tokenAuthorization.replace("Bearer ", "");

        return this.authService.logout(response, accessToken);
    }
}
