package com.sustentify.sustentify_app.products;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.products.dtos.ProductSummaryDto;
import com.sustentify.sustentify_app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.products.dtos.ResponseDto;
import com.sustentify.sustentify_app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.products.entities.Product;
import com.sustentify.sustentify_app.products.services.ProductsService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/products")
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductSummaryDto>> findAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<ProductSummaryDto> productList = this.productsService.findAll(page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(productList);
    }

    @GetMapping("/my-products")
    public ResponseEntity<Page<Product>> findMyProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Company company = SecurityUtils.getCurrentCompany();

        Page<Product> productList = this.productsService.getProductsByCompany(company, page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(productList);
    }

    @PostMapping
    public ResponseEntity<Product> create(@Validated @RequestBody RegisterProductDto registerProductDto) {
        Company company = SecurityUtils.getCurrentCompany();

        return this.productsService.create(registerProductDto, company);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> productDetails(@PathVariable("id") Long productId) {
        Product product = this.productsService.findById(productId);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(product);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDto> update(@PathVariable("id") Long productId, @RequestBody UpdateProductDto updateProductDto) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId, company);

        return this.productsService.update(product, updateProductDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("id") Long productId) {
        Company company = SecurityUtils.getCurrentCompany();
        Product product = this.productsService.findById(productId, company);

        return this.productsService.delete(product);
    }
}
