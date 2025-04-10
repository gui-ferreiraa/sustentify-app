package com.sustentify.sustentify_app.app.products;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.dtos.ProductFilterDto;
import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;
import com.sustentify.sustentify_app.app.products.enums.Material;
import com.sustentify.sustentify_app.config.security.SecurityUtils;
import com.sustentify.sustentify_app.app.products.dtos.ProductSummaryDto;
import com.sustentify.sustentify_app.app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import com.sustentify.sustentify_app.app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/v1/products")
public class ProductsController {

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductSummaryDto>> findAll(
            @RequestParam(value = "category", required = false) Category category,
            @RequestParam(value = "condition", required = false) Condition condition,
            @RequestParam(value = "material", required = false) Material material,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        ProductFilterDto filter = new ProductFilterDto(category, condition, material);
        Page<ProductSummaryDto> productList = this.productsService.findAllFiltered(page, size, filter);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(productList);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<ProductSummaryDto>> trendingProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<ProductSummaryDto> productList = this.productsService.findTrendingProducts(page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(productList);
    }

    @GetMapping("/my")
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

    @PostMapping("/{id}/thumbnail")
    public ResponseEntity<ResponseDto> thumbnail(
            @PathVariable("id") Long productId,
            @RequestParam("file")MultipartFile file
    ) {
        productsService.uploadThumbnailImage(productId, file);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ResponseDto(
                        HttpStatus.ACCEPTED,
                        "Thumbnail uploaded successfully",
                        true,
                        Optional.empty()
                ));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ResponseDto> uploadImages(
            @PathVariable("id") Long productId,
            @RequestParam("files")MultipartFile[] files
    ) {
        productsService.uploadImages(productId, files);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ResponseDto(
                        HttpStatus.ACCEPTED,
                        "Images uploaded successfully",
                        true,
                        Optional.empty()
                ));
    }

    @DeleteMapping("/{id}/images")
    public ResponseEntity<ResponseDto> deleteImage(
            @PathVariable("id") Long productId,
            @RequestParam("publicId") String publicId
    ) {
        productsService.deleteProductImage(productId, publicId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(
                        HttpStatus.OK,
                        "Images deleted successfully",
                        true,
                        Optional.empty()
                ));
    }

    @DeleteMapping("/{id}/thumbnail")
    public ResponseEntity<ResponseDto> deleteThumbnail(
            @PathVariable("id") Long productId,
            @RequestParam("publicId") String publicId
    ) {
        productsService.deleteThumbnail(productId, publicId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(
                        HttpStatus.OK,
                        "Thumbnail deleted successfully",
                        true,
                        Optional.empty()
                ));
    }
}
