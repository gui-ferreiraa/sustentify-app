package com.sustentify.sustentify_app.app.interestedProducts.services;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.repositories.InterestedProductsRepository;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterestedProductsService {
    private final InterestedProductsRepository interestedProductsRepository;

    public InterestedProductsService(InterestedProductsRepository interestedProductsRepository) {
        this.interestedProductsRepository = interestedProductsRepository;
    }

    public ResponseEntity<List<InterestedProducts>> findByBuyer(Company company) {
        List<InterestedProducts> interestedProductsList = this.interestedProductsRepository.findByBuyer(company);

        return ResponseEntity.status(HttpStatus.OK).body(interestedProductsList);
    }

    public Optional<InterestedProducts> findByBuyerAndProduct(Company company, Product product) {
        return this.interestedProductsRepository.findByBuyerAndProduct(company, product);
    }

    public ResponseEntity<InterestedProducts> create(Company company, Product product, int quantity) {
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setBuyer(company);
        interestedProducts.setProduct(product);
        interestedProducts.setQuantity(quantity);
        interestedProducts.setStatus(InterestStatus.PENDING);

        InterestedProducts newInterestedProduct = this.interestedProductsRepository.save(interestedProducts);

        return ResponseEntity.status(HttpStatus.CREATED).body(newInterestedProduct);
    }

    public ResponseEntity<InterestedProducts> updateInterestedStatus(InterestedProducts interestedProducts, InterestStatus interestStatus) {
        interestedProducts.setStatus(interestStatus);
        this.interestedProductsRepository.save(interestedProducts);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(interestedProducts);
    }

    public ResponseEntity<ResponseDto> delete(InterestedProducts interestedProducts) {
        this.interestedProductsRepository.delete(interestedProducts);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(HttpStatus.OK, "Interested Product Deleted", true, Optional.empty()));
    }
}
