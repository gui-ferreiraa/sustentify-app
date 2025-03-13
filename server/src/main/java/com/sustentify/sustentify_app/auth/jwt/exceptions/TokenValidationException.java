package com.sustentify.sustentify_app.auth.jwt.exceptions;

public class TokenValidationException extends RuntimeException {
    public TokenValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
