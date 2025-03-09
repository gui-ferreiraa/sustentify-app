package com.sustentify.sustentify_app.auth.dtos;


public record ResponseDto (
        String name,
        String email,
        String accessToken
) {
}
