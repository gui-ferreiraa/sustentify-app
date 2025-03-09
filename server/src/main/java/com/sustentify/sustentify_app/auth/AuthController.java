package com.sustentify.sustentify_app.auth;

import com.sustentify.sustentify_app.auth.dtos.LoginCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.auth.dtos.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody LoginCompanyDto loginCompanyDto) {
        return this.authService.login(loginCompanyDto);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> register(@RequestBody RegisterCompanyDto registerCompanyDto) {
        return this.authService.register(registerCompanyDto);
    }
}
