package com.sustentify.sustentify_app.products.dtos;

import org.springframework.http.HttpStatus;

import java.util.Optional;

public record ResponseDto(
        HttpStatus status,
        String message,
        boolean successfully,
        Optional<String> name
) {
}
