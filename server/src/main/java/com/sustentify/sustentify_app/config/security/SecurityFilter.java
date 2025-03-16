package com.sustentify.sustentify_app.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sustentify.sustentify_app.auth.jwt.TokenService;
import com.sustentify.sustentify_app.auth.jwt.exceptions.TokenValidationException;
import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.companies.exceptions.CompanyNotFoundException;
import com.sustentify.sustentify_app.companies.repositories.CompaniesRepository;
import com.sustentify.sustentify_app.config.exceptions.ResponseError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final CompaniesRepository companiesRepository;

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
            try {
                var login = this.tokenService.validateToken(token);

                Company company = this.companiesRepository.findByEmail(login).orElseThrow(CompanyNotFoundException::new);
                var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                var authentication = new UsernamePasswordAuthenticationToken(company, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (TokenValidationException e) {
                ResponseError responseError = new ResponseError(HttpStatus.UNAUTHORIZED, e.getMessage());

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                ObjectMapper objectMapper = new ObjectMapper();
                String jsonResponse = objectMapper.writeValueAsString(responseError);

                response.getWriter().write(jsonResponse);

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
