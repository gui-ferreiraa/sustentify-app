package com.sustentify.sustentify_app.interestedProducts;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.interestedProducts.dtos.UpdateInterestStatusDto;
import com.sustentify.sustentify_app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.interestedProducts.exceptions.InterestedProductsInvalidException;
import com.sustentify.sustentify_app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.products.entities.Product;
import com.sustentify.sustentify_app.products.services.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/interested-products")
public class InterestedProductsController {
    private final InterestedProductsService interestedProductsService;
    private final ProductsService productsService;

    public InterestedProductsController(InterestedProductsService interestedProductsService, ProductsService productsService) {
        this.interestedProductsService = interestedProductsService;
        this.productsService = productsService;
    }

    @GetMapping
    public ResponseEntity<List<InterestedProducts>> getInterestedProducts() {
        Company company = SecurityUtils.getCurrentCompany();

        return this.interestedProductsService.findByCompany(company);
    }

    @PostMapping("{id}")
    public ResponseEntity<InterestedProducts> create(@PathVariable("id") Long productId) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        if (Objects.equals(product.getCompany().getId(), company.getId())) {
            throw new InterestedProductsInvalidException("Interest in the product is not acceptable");
        }

        this.interestedProductsService.findByCompanyAndProduct(company, product)
                .ifPresent(existingInterest -> {
                    throw new InterestedProductsInvalidException("Interest Duplicate");
                });

        return this.interestedProductsService.create(company, product);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long productId) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        InterestedProducts interestedProducts = this.interestedProductsService.findByCompanyAndProduct(company, product).orElseThrow(InterestedProductsNotFoundException::new);

        return this.interestedProductsService.delete(interestedProducts);
    }

    @PutMapping("{id}")
    public ResponseEntity<InterestedProducts> updateInterestedStatus(
            @PathVariable("id") Long productId,
            @RequestBody UpdateInterestStatusDto updateInterestStatusDto
    ) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        if (!Objects.equals(product.getCompany().getId(), company.getId())) {
            throw new RuntimeException("NOT ACCETABLLE");
        }

        InterestedProducts interestedProducts = this.interestedProductsService.findByCompanyAndProduct(company, product).orElseThrow(InterestedProductsNotFoundException::new);

        return this.interestedProductsService.updateInterestedStatus(interestedProducts, updateInterestStatusDto.status());
    }
}
