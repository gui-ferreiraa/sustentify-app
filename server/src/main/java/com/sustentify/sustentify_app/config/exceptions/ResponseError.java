package com.sustentify.sustentify_app.config.exceptions;

import org.springframework.http.HttpStatus;

public class ResponseError {
    private HttpStatus status;
    private String message;
    private final Boolean successfully = false;

    public ResponseError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getSuccessfully() {
        return successfully;
    }
}
