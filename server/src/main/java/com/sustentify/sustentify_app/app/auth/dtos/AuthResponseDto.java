package com.sustentify.sustentify_app.app.auth.dtos;


public record AuthResponseDto(
        String name,
        String email,
        String accessToken
) {
}
