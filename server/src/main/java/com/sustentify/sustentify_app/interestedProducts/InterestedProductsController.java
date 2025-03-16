package com.sustentify.sustentify_app.interestedProducts;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.products.entities.Product;
import com.sustentify.sustentify_app.products.services.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        return this.interestedProductsService.create(company, product);
    }

    @PutMapping("{id}")
    public ResponseEntity<InterestedProducts> updateInterestedStatus(
            @PathVariable("id") Long productId,
            @RequestBody InterestStatus interestStatus
    ) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);
        InterestedProducts interestedProducts = this.interestedProductsService.findByCompanyAndProduct(company, product);

        return this.interestedProductsService.updateInterestedStatus(interestedProducts, interestStatus);
    }
}
