package com.sustentify.sustentify_app.app.interestedProducts;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.RegisterInterestProductDto;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.UpdateInterestStatusDto;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsInvalidException;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import com.sustentify.sustentify_app.dtos.ResponseDto;
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

        return this.interestedProductsService.findByBuyer(company);
    }

    @PostMapping("{id}")
    public ResponseEntity<InterestedProducts> create(
            @PathVariable(value = "id") Long productId,
            @RequestBody RegisterInterestProductDto registerInterestProductDto
            ) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        if (Objects.equals(product.getCompany().getId(), company.getId())) {
            throw new InterestedProductsInvalidException("Interest in the product is not acceptable");
        }

        if (product.getQuantity() < registerInterestProductDto.quantity()) {
            throw new InterestedProductsInvalidException("Quantity is greater than available");
        }

        this.interestedProductsService.findByBuyerAndProduct(company, product)
                .ifPresent(existingInterest -> {
                    throw new InterestedProductsInvalidException("Interest Duplicate");
                });

        return this.interestedProductsService.create(company, product, registerInterestProductDto.quantity());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("id") Long productId) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        InterestedProducts interestedProducts = this.interestedProductsService.findByBuyerAndProduct(company, product).orElseThrow(InterestedProductsNotFoundException::new);

        return this.interestedProductsService.delete(interestedProducts);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<InterestedProducts> updateInterestedStatus(
            @PathVariable("id") Long productId,
            @RequestBody UpdateInterestStatusDto updateInterestStatusDto
    ) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        if (!Objects.equals(product.getCompany().getId(), company.getId())) {
            throw new RuntimeException("NOT UNACCEPTABLE");
        }

        InterestedProducts interestedProducts = this.interestedProductsService.findByBuyerAndProduct(company, product).orElseThrow(InterestedProductsNotFoundException::new);

        return this.interestedProductsService.updateInterestedStatus(interestedProducts, updateInterestStatusDto.status());
    }
}
