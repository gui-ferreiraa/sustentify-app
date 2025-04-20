package com.sustentify.sustentify_app.app.interestedProducts.services;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.RegisterInterestProductDto;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.UpdateInterestDto;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.app.interestedProducts.repositories.InterestedProductsRepository;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterestedProductsService {

    private final InterestedProductsRepository interestedProductsRepository;
    private final ProductsService productsService;

    public InterestedProductsService(InterestedProductsRepository interestedProductsRepository, ProductsService productsService) {
        this.interestedProductsRepository = interestedProductsRepository;
        this.productsService = productsService;
    }

    public List<InterestedProducts> findByBuyer(Company company) {return this.interestedProductsRepository.findByBuyer(company);}

    public Optional<InterestedProducts> findByBuyerAndProduct(Company company, Product product) {
        return this.interestedProductsRepository.findByBuyerAndProduct(company, product);
    }

    public InterestedProducts findById(Long id) {return this.interestedProductsRepository.findById(id).orElseThrow(InterestedProductsNotFoundException::new);}

    public List<InterestedProducts> findByProductId(Long productId) {
        Product product = this.productsService.findById(productId);

        return this.interestedProductsRepository.findByProduct(product);
    }

    public InterestedProducts create(Company company, Product product, RegisterInterestProductDto interestProductDto) {
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setBuyer(company);
        interestedProducts.setProduct(product);
        interestedProducts.setQuantity(interestProductDto.quantity());
        interestedProducts.setStatus(InterestStatus.PENDING);
        interestedProducts.setMessage(interestProductDto.message());

        return this.interestedProductsRepository.save(interestedProducts);
    }

    public InterestedProducts update(InterestedProducts interestedProducts, UpdateInterestDto dto) {
        applyUpdate(interestedProducts, dto);
        return this.interestedProductsRepository.save(interestedProducts);
    }

    private void applyUpdate(InterestedProducts prod, UpdateInterestDto dto) {
        if (dto.status() != null) prod.setStatus(dto.status());
        if (dto.quantity() != null) prod.setQuantity(dto.quantity());
    }

    public void delete(InterestedProducts interestedProducts) {

        this.interestedProductsRepository.delete(interestedProducts);

    }
}
