package com.sustentify.sustentify_app.config.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;

public class ResponseError {
    private HttpStatus status;
    private String message;
    private List<String> errors;

    public ResponseError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResponseError(HttpStatus status, String message, List<String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
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
        return false;
    }

    public List<String> getErrors() {
        if (errors == null) return List.of();

        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
