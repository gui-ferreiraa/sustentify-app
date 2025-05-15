package com.sustentify.sustentify_app.app.auth;

import com.sustentify.sustentify_app.app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.app.auth.dtos.RecoverDto;
import com.sustentify.sustentify_app.app.auth.dtos.RecoverPasswordDto;
import com.sustentify.sustentify_app.app.auth.dtos.AuthResponseDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.services.CompaniesService;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final CompaniesService companiesService;
    private final EmailsService emailsService;

    public AuthController(AuthService authService, CompaniesService companiesService, EmailsService emailsService) {
        this.authService = authService;
        this.companiesService = companiesService;
        this.emailsService = emailsService;
    }

    @GetMapping()
    public ResponseEntity<Company> companyLogged(@RequestHeader("Authorization") String tokenAuthorization) {
        String accessToken = tokenAuthorization.replace("Bearer ", "");

        return this.authService.companyLogged(accessToken);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginCompanyDto loginCompanyDto, HttpServletResponse response) {
        return this.authService.login(loginCompanyDto, response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(HttpServletRequest request, HttpServletResponse response) {
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

    @PostMapping("/recover")
    public ResponseEntity<ResponseDto> recover(@RequestBody RecoverDto dto) {
        this.authService.sendEmailRecoverPassword(dto);

        ResponseDto res = new ResponseDto(HttpStatus.ACCEPTED, "Email sending", true, Optional.empty());
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(res);
    }

    @PatchMapping("/update-password/{token}")
    public ResponseEntity<ResponseDto> updatePassword(
            @PathVariable String token,
            @RequestBody RecoverPasswordDto recoverPasswordDto

    ) {
        this.authService.updatePassword(recoverPasswordDto, token);

        var res = new ResponseDto(HttpStatus.ACCEPTED, "Password Updated", true, Optional.empty());

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(res);
    }
}
