package com.sustentify.sustentify_app.app.interestedProducts;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.InterestedProductsDto;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.RegisterInterestProductDto;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsInvalidException;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
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

    @GetMapping("{id}")
    public ResponseEntity<InterestedProductsDto> getInterestedById(
            @PathVariable(value = "id") Long id
    ) {
        InterestedProductsDto list = this.interestedProductsService.findById(id);

        return ResponseEntity
            .ok(list);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<List<InterestedProducts>> getInterestedByProductId(
            @PathVariable(value = "id") Long id
    ) {
        List<InterestedProducts> list = this.interestedProductsService.findByProductId(id);

        return ResponseEntity
                .ok(list);
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

        return this.interestedProductsService.create(company, product, registerInterestProductDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("id") Long productId) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId);

        InterestedProducts interestedProducts = this.interestedProductsService.findByBuyerAndProduct(company, product).orElseThrow(InterestedProductsNotFoundException::new);

        return this.interestedProductsService.delete(interestedProducts);
    }
}
