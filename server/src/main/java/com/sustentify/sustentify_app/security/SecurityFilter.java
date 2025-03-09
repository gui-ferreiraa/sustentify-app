package com.sustentify.sustentify_app.security;

import com.sustentify.sustentify_app.companies.CompaniesRepository;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.jwt.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    private TokenService tokenService;
    private CompaniesRepository companiesRepository;

    public SecurityFilter(TokenService tokenService, CompaniesRepository companiesRepository) {
        this.tokenService = tokenService;
        this.companiesRepository = companiesRepository;
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);

        if (token != null ) {
            var login = this.tokenService.validateToken(token);

            if (login != null) {
                Company company = this.companiesRepository.findByEmail(login).orElseThrow(() -> new RuntimeException("Company Not Found"));
                var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                var authentication = new UsernamePasswordAuthenticationToken(company, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
