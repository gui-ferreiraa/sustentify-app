package com.sustentify.sustentify_app.auth.jwt.exceptions;

public class TokenGenerationException extends RuntimeException {
    public TokenGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
