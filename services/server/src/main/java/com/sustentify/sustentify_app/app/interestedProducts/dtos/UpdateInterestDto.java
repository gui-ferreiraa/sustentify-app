package com.sustentify.sustentify_app.app.interestedProducts.dtos;

import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;

public record UpdateInterestDto(
        InterestStatus status,
        Integer quantity
) {
}
