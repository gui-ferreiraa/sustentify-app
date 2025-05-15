package com.sustentify.sustentify_app.app.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.sustentify.sustentify_app.app.auth.jwt.exceptions.TokenGenerationException;
import com.sustentify.sustentify_app.app.auth.jwt.exceptions.TokenValidationException;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.cache.CacheService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    private static final String REVOKED_TOKEN_PREFIX = "token:revoked:";
    private static final Duration REVOKED_TOKEN_DURATION = Duration.ofHours(12);
    private static final String issuer = "login-auth-api";

    private final CacheService cacheService;

    public TokenService(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    public String generateAccessToken(Company company) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(company.getEmail())
                    .withExpiresAt(this.generateExpirationDate(2))
                    .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new TokenGenerationException("Token generation Error", exception);
        }
    }

    public void revokeToken(String token) {
        String key = REVOKED_TOKEN_PREFIX + token;
        cacheService.put(key, "revoked", REVOKED_TOKEN_DURATION);
    }

    public boolean isRevoked(String token) {
        String key = REVOKED_TOKEN_PREFIX + token;
        return cacheService.exists(key);
    }

    public String generateAccessToken(Company company, int plusHours, long minutes) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(company.getEmail())
                    .withExpiresAt(this.generateExpirationDate(plusHours, minutes))
                    .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new TokenGenerationException("Token generation Error", exception);
        }
    }

    public String generateRefreshToken(Company company) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(company.getEmail())
                    .withExpiresAt(this.generateExpirationDate(24))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new TokenGenerationException("Token generation Error", exception);
        }
    }

    public String validateToken(String token) {
        try {
            if (isRevoked(token)) {
                throw new TokenValidationException("Token is revoked");
            }

            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException exception) {
            throw new TokenValidationException("Token expired", exception);
        }
    }

    private Instant generateExpirationDate(int plusHours) {
        return LocalDateTime.now().plusHours(plusHours).toInstant(ZoneOffset.of("-03:00"));
    }

    private Instant generateExpirationDate(int plusHours, Long minutes) {
        return LocalDateTime.now().plusHours(plusHours).plusMinutes(minutes).toInstant(ZoneOffset.of("-03:00"));
    }
}
