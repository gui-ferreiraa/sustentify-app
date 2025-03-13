package com.sustentify.sustentify_app.products.services;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.products.dtos.ResponseDto;
import com.sustentify.sustentify_app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.products.entities.Product;
import com.sustentify.sustentify_app.products.repositories.ProductsRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {
    private final ProductsRepository productsRepository;

    public ProductsService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    public Product findById(Long productId) {

        return this.productsRepository.findById(productId).orElseThrow(() -> new RuntimeException("Error"));
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

    public List<Product> findAll() {
        return this.productsRepository.findAll();
    }

    public List<Product> findByCompany(Company company) {
        return this.productsRepository.findByCompany(company);
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
