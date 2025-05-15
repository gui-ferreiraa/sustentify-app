package com.sustentify.sustentify_app.config.security;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Company getCurrentCompany() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("No authentication found in context.");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Company) {
            return (Company) principal;
        } else {
            throw new IllegalStateException("Authenticated user is not a company");
        }
    }
}
