package com.sustentify.sustentify_app.app.interestedProducts.exceptions;

public class InterestedProductsNotFoundException extends RuntimeException {
    public InterestedProductsNotFoundException() {
        super("Interest Product Not Found");
    }

    public InterestedProductsNotFoundException(String message) {
        super(message);
    }
}
