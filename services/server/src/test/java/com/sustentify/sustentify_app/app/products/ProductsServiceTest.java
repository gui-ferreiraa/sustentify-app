package com.sustentify.sustentify_app.app.products;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.enums.Category;
import com.sustentify.sustentify_app.app.products.enums.Condition;
import com.sustentify.sustentify_app.app.products.enums.Material;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import com.sustentify.sustentify_app.app.products.repositories.ProductsRepository;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.Optional;

class ProductsServiceTest {

    @Mock
    private ProductsRepository productsRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private ProductsService productsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should create product successfuly when everynthing is OK")
    void createProductCase1() {
        RegisterProductDto productDto = new RegisterProductDto(
                "test", Category.FOOD, "description", Condition.AVAILABLE, Material.CERAMIC, Instant.now(), 30.0, "location", 2
        );
        Company company = new Company();
        company.setId("id-1");

        Product mockSavedProduct = new Product();
        mockSavedProduct.setId("product-id");
        mockSavedProduct.setCategory(Category.FOOD);
        mockSavedProduct.setCondition(Condition.AVAILABLE);
        mockSavedProduct.setDescription("description");
        mockSavedProduct.setName("test");
        mockSavedProduct.setCompany(company);

        Mockito.when(productsRepository.save(Mockito.any(Product.class))).thenReturn(mockSavedProduct);

        Product savedProduct = productsService.create(productDto, company);

        Assertions.assertEquals(Category.FOOD, savedProduct.getCategory());
        Assertions.assertEquals(Condition.AVAILABLE, savedProduct.getCondition());
        Assertions.assertEquals(productDto.description(), savedProduct.getDescription());
        Assertions.assertEquals(productDto.name(), savedProduct.getName());
        Mockito.verify(productsRepository, Mockito.times(1)).save(Mockito.any(Product.class));
    }

    @Test
    @DisplayName("Should find products by Id Successfully")
    void findProductsByIdCase1() {
        String productId = "product-id";
        Product mockSavedProduct = new Product();
        mockSavedProduct.setId("product-id");

        Mockito.when(productsRepository.findById(productId)).thenReturn(Optional.of(mockSavedProduct));

        Product foundProduct = productsService.findById(productId);

        Assertions.assertEquals(Product.class, foundProduct.getClass());
        Assertions.assertEquals(productId, foundProduct.getId());
        Mockito.verify(productsRepository, Mockito.times(1)).findById(productId);
    }

    @Test
    @DisplayName("Should find products by Id Throw ProductNotFoundException")
    void findProductsByIdCase2() {
        String productId = "product-id";
        Product mockSavedProduct = new Product();
        mockSavedProduct.setId("product-id");

        Mockito.when(productsRepository.findById(productId)).thenReturn(Optional.empty());

        Assertions.assertThrows(ProductNotFoundException.class, () -> {
            productsService.findById(productId);
        });
        Mockito.verify(productsRepository, Mockito.times(1)).findById(productId);
    }

    @Test
    @DisplayName("Should find products by Id and Company Successfully")
    void findByIdAndCompanyCase1() {
        String productId = "product-id";
        Company company = new Company();
        Product mockSavedProduct = new Product();
        mockSavedProduct.setId("product-id");
        mockSavedProduct.setCompany(company);

        Mockito.when(productsRepository.findByIdAndCompany(productId, company)).thenReturn(Optional.of(mockSavedProduct));

        Product foundProduct = productsService.findByIdAndCompany(productId, company);

        Assertions.assertEquals(Product.class, foundProduct.getClass());
        Assertions.assertEquals(productId, foundProduct.getId());
        Assertions.assertEquals(company, foundProduct.getCompany());

        Mockito.verify(productsRepository, Mockito.times(1)).findByIdAndCompany(productId, company);
    }

    @Test
    @DisplayName("Should find products by Id and Company Throw ProductNotFoundException")
    void findByIdAndCompanyCase2() {
        String productId = "product-id";
        Product mockSavedProduct = new Product();
        mockSavedProduct.setId("product-id");
        Company company = new Company();

        Mockito.when(productsRepository.findByIdAndCompany(productId, company)).thenReturn(Optional.empty());

        Assertions.assertThrows(ProductNotFoundException.class, () -> {
            productsService.findById(productId);
        });

        Mockito.verify(productsRepository, Mockito.times(1)).findById(productId);
    }
}