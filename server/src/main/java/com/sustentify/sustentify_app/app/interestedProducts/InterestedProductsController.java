package com.sustentify.sustentify_app.app.interestedProducts;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.InterestedProductsDto;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.RegisterInterestProductDto;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.UpdateInterestDto;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsInvalidException;
import com.sustentify.sustentify_app.app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
    public ResponseEntity<List<InterestedProducts>> findAllByCompany() {
        Company company = SecurityUtils.getCurrentCompany();

        List<InterestedProducts> res = this.interestedProductsService.findByBuyer(company);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(res);
    }

    @GetMapping("{id}")
    public ResponseEntity<InterestedProductsDto> findById(
            @PathVariable(value = "id") Long id
    ) {
        InterestedProducts list = this.interestedProductsService.findById(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new InterestedProductsDto(list));
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<List<InterestedProducts>> findByProductId(
            @PathVariable(value = "id") Long id
    ) {
        List<InterestedProducts> list = this.interestedProductsService.findByProductId(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(list);
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

        InterestedProducts newInterested = this.interestedProductsService.create(company, product, registerInterestProductDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newInterested);
    }

    @PatchMapping("{id}")
    public ResponseEntity<ResponseDto> update(
            @PathVariable("id") Long interestedId,
            @RequestBody UpdateInterestDto dto
    ) {
        InterestedProducts interestedProducts = this.interestedProductsService.findById(interestedId);

        this.interestedProductsService.update(interestedProducts, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(
                        HttpStatus.OK,
                        "Updated with successfully",
                        true,
                        Optional.empty()
                ));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("id") Long interestedId) {
        InterestedProducts interestedProducts = this.interestedProductsService.findById(interestedId);

        this.interestedProductsService.delete(interestedProducts);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ResponseDto(HttpStatus.ACCEPTED, "Interested Product Deleted", true, Optional.empty()));
    }
}
