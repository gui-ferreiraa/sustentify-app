package com.sustentify.sustentify_app.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.sustentify.sustentify_app.companies.entities.Company;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;
    private final String issuer = "login-auth-api";

    public String generateAccessToken(Company company) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(company.getEmail())
                    .withExpiresAt(this.generateExpirationDate(2))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Teste");
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
            throw new RuntimeException("Teste");
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant generateExpirationDate(int plusHours) {
        return LocalDateTime.now().plusHours(plusHours).toInstant(ZoneOffset.of("-03:00"));
    }
}
