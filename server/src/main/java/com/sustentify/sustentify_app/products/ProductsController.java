package com.sustentify.sustentify_app.products;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.products.dtos.ResponseDto;
import com.sustentify.sustentify_app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.products.entities.Product;
import com.sustentify.sustentify_app.products.services.ProductsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/products")
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping()
    public ResponseEntity<List<Product>> findAll() {
        List<Product> productList = this.productsService.findAll();

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(productList);
    }

    @PostMapping()
    public ResponseEntity<Product> create(@RequestBody RegisterProductDto registerProductDto) {
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
        Product product = this.productsService.findById(productId);

        return this.productsService.update(product, updateProductDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("id") Long productId) {
        Product product = this.productsService.findById(productId);

        return this.productsService.delete(product);
    }
}
