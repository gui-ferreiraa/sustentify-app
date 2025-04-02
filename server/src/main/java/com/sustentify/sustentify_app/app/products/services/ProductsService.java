package com.sustentify.sustentify_app.app.products.services;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.dtos.ProductFilterDto;
import com.sustentify.sustentify_app.app.products.dtos.ProductSummaryDto;
import com.sustentify.sustentify_app.app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import com.sustentify.sustentify_app.app.products.repositories.ProductsRepository;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

@Service
public class ProductsService {
    private final ProductsRepository productsRepository;

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    public Product findById(Long productId) {

        return this.productsRepository.findById(productId).orElseThrow(ProductNotFoundException::new);
    }

    public Product findById(Long productId, Company company) {

        return this.productsRepository.findByIdAndCompany(productId, company).orElseThrow(ProductNotFoundException::new);
    }

    public ResponseEntity<Product> create(RegisterProductDto registerProductDto, Company company) {
        Product newProduct = new Product();
        newProduct.setCategory(registerProductDto.category());
        newProduct.setCompany(company);
        newProduct.setCondition(registerProductDto.condition());
        newProduct.setDescription(registerProductDto.description());
        newProduct.setName(registerProductDto.name());
        newProduct.setProductionDate(registerProductDto.productionDate());
        newProduct.setMaterial(registerProductDto.material());
        newProduct.setLocation(registerProductDto.location());
        newProduct.setDisposalDate(Instant.now().atOffset(ZoneOffset.of("-03:00")).toInstant());
        newProduct.setPrice(registerProductDto.price());
        newProduct.setQuantity(registerProductDto.quantity());

        Product product = this.productsRepository.save(newProduct);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(product);
    }

    public Page<ProductSummaryDto> findAllFiltered(int page, int size, ProductFilterDto filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Specification<Product> specification = filter.toSpecification();

        Page<Product> productPage = this.productsRepository.findAll(specification, pageable);

        return productPage.map(ProductSummaryDto::new);
    }

    public Page<Product> getProductsByCompany(Company company, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return this.productsRepository.findByCompany(company, pageable);
    }

    public Page<ProductSummaryDto> findTrendingProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").descending());

        return this.productsRepository.findTopByInterestCount(pageable).map(ProductSummaryDto::new);
    }

    public ResponseEntity<ResponseDto> update(Product product, UpdateProductDto updateProductDto) {

        BeanUtils.copyProperties(updateProductDto, product);

        this.productsRepository.save(product);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ResponseDto(HttpStatus.ACCEPTED, "Product Updated", true, Optional.ofNullable(product.getName())));
    }

    public ResponseEntity<ResponseDto> delete(Product product) {
        this.productsRepository.delete(product);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ResponseDto(HttpStatus.ACCEPTED, "Product Deleted", true, Optional.ofNullable(product.getName())));
    }
}
