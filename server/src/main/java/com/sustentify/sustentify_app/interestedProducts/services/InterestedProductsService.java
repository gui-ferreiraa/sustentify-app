package com.sustentify.sustentify_app.interestedProducts.services;

import com.sustentify.sustentify_app.companies.entities.Company;
import com.sustentify.sustentify_app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.interestedProducts.repositories.InterestedProductsRepository;
import com.sustentify.sustentify_app.products.entities.Product;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class InterestedProductsService {
    private final InterestedProductsRepository interestedProductsRepository;

    public InterestedProductsService(InterestedProductsRepository interestedProductsRepository) {
        this.interestedProductsRepository = interestedProductsRepository;
    }

    public ResponseEntity<List<InterestedProducts>> findByCompany(Company company) {
        List<InterestedProducts> interestedProductsList = this.interestedProductsRepository.findByCompany(company);

        return ResponseEntity.status(HttpStatus.OK).body(interestedProductsList);
    }

    public InterestedProducts findByCompanyAndProduct(Company company, Product product) {
        return this.interestedProductsRepository.findByCompanyAndProduct(company, product);
    }

    public ResponseEntity<InterestedProducts> create(Company company, Product product) {
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setCompany(company);
        interestedProducts.setProduct(product);
        interestedProducts.setStatus(InterestStatus.PENDING);
        interestedProducts.setInterestDate(Instant.now());

        InterestedProducts newInterestedProduct = this.interestedProductsRepository.save(interestedProducts);

        return ResponseEntity.status(HttpStatus.CREATED).body(newInterestedProduct);
    }

    public ResponseEntity<InterestedProducts> updateInterestedStatus(InterestedProducts interestedProducts, InterestStatus interestStatus) {
        interestedProducts.setStatus(interestStatus);
        this.interestedProductsRepository.save(interestedProducts);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(interestedProducts);
    }

    public ResponseEntity<String> delete(InterestedProducts interestedProducts) {
        this.interestedProductsRepository.delete(interestedProducts);

        return ResponseEntity.status(HttpStatus.OK).body("DELETED");
    }
}
