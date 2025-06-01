package com.sustentify.sustentify_app.app;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.interestedProducts.InterestStatus;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.RegisterInterestProductDto;
import com.sustentify.sustentify_app.app.interestedProducts.dtos.UpdateInterestDto;
import com.sustentify.sustentify_app.app.interestedProducts.entities.InterestedProducts;
import com.sustentify.sustentify_app.app.interestedProducts.exceptions.InterestedProductsNotFoundException;
import com.sustentify.sustentify_app.app.interestedProducts.repositories.InterestedProductsRepository;
import com.sustentify.sustentify_app.app.interestedProducts.services.InterestedProductsService;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import com.sustentify.sustentify_app.app.products.services.ProductsService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class InterestedProductsServiceTests {
    @Mock
    private InterestedProductsRepository interestedProductsRepository;
    @Mock
    private ProductsService productsService;

    @InjectMocks
    private InterestedProductsService interestedProductsService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should findByBuyer is Successfully")
    void findByBuyerCase1() {
        Company company = new Company();

        Mockito.when(interestedProductsRepository.findByBuyer(company)).thenReturn(List.of());

        List<InterestedProducts> list = interestedProductsService.findByBuyer(company);

        Mockito.verify(interestedProductsRepository, Mockito.times(1)).findByBuyer(company);
        Assertions.assertTrue(list.isEmpty());
    }

    @Test
    @DisplayName("Should findById is Successfully")
    void findByIdCase1() {
        String id = UUID.randomUUID().toString();
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setId(id);

        Mockito.when(interestedProductsRepository.findById(id)).thenReturn(Optional.of(interestedProducts));

        InterestedProducts res = interestedProductsService.findById(id);

        Mockito.verify(interestedProductsRepository, Mockito.times(1)).findById(id);
        Assertions.assertEquals(id, res.getId());
    }

    @Test
    @DisplayName("Should findById throws InterestedProductsNotFoundException")
    void findByIdCase2() {
        String id = UUID.randomUUID().toString();

        Mockito.when(interestedProductsRepository.findById(id)).thenReturn(Optional.empty());

        Assertions.assertThrows(InterestedProductsNotFoundException.class, () -> interestedProductsService.findById(id));
    }

    @Test
    @DisplayName("Should findByProductId is Successfully")
    void findByProductIdCase1() {
        String id = UUID.randomUUID().toString();

        Mockito.when(productsService.findById(id)).thenReturn(Mockito.mock(Product.class));
        Mockito.when(interestedProductsRepository.findByProduct(Mockito.any())).thenReturn(List.of());

        interestedProductsService.findByProductId(id);

        Mockito.verify(productsService, Mockito.times(1)).findById(id);
        Mockito.verify(interestedProductsRepository, Mockito.times(1)).findByProduct(Mockito.any());
    }

    @Test
    @DisplayName("Should findByProductId throws ProductNotFoundException")
    void findByProductIdCase2() {
        String id = UUID.randomUUID().toString();

        Mockito.when(productsService.findById(id)).thenThrow(ProductNotFoundException.class);
        Mockito.when(interestedProductsRepository.findByProduct(Mockito.any())).thenReturn(List.of());

        Assertions.assertThrows(ProductNotFoundException.class, () -> interestedProductsService.findByProductId(id));
    }

    @Test
    @DisplayName("Should create is Successfully")
    void createCase1() {
        Company company = new Company();
        company.setId(UUID.randomUUID().toString());
        company.setName("Empresa Teste");

        Product product = new Product();
        product.setId(UUID.randomUUID().toString());
        product.setName("Produto Teste");

        RegisterInterestProductDto dto = new RegisterInterestProductDto(5, "Estou interessado");

        InterestedProducts savedInterestedProduct = new InterestedProducts();
        savedInterestedProduct.setId(UUID.randomUUID().toString());
        savedInterestedProduct.setBuyer(company);
        savedInterestedProduct.setProduct(product);
        savedInterestedProduct.setQuantity(5);
        savedInterestedProduct.setStatus(InterestStatus.PENDING);
        savedInterestedProduct.setMessage("Estou interessado");

        Mockito.when(interestedProductsRepository.save(Mockito.any(InterestedProducts.class)))
                .thenReturn(savedInterestedProduct);

        InterestedProducts result = interestedProductsService.create(company, product, dto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(company, result.getBuyer());
        Assertions.assertEquals(product, result.getProduct());
        Assertions.assertEquals(5, result.getQuantity());
        Assertions.assertEquals(InterestStatus.PENDING, result.getStatus());
        Assertions.assertEquals("Estou interessado", result.getMessage());

        Mockito.verify(interestedProductsRepository, Mockito.times(1))
                .save(Mockito.any(InterestedProducts.class));
    }

    @Test
    @DisplayName("Should update is Successfully")
    void updateCase1() {
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setId(UUID.randomUUID().toString());

        UpdateInterestDto dto = new UpdateInterestDto(InterestStatus.PENDING, 0);

        interestedProducts.setStatus(InterestStatus.PENDING);
        interestedProducts.setQuantity(0);

        Mockito.when(interestedProductsRepository.save(Mockito.any(InterestedProducts.class))).thenReturn(interestedProducts);

        InterestedProducts result = interestedProductsService.update(interestedProducts, dto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(interestedProducts.getQuantity(), result.getQuantity());
        Assertions.assertEquals(interestedProducts.getStatus(), result.getStatus());
    }

    @Test
    @DisplayName("Should delete is Successfully")
    void deleteCase1() {
        InterestedProducts interestedProducts = new InterestedProducts();
        interestedProducts.setId(UUID.randomUUID().toString());

        interestedProductsService.delete(interestedProducts);

        Mockito.verify(interestedProductsRepository, Mockito.times(1)).delete(interestedProducts);
    }
}
