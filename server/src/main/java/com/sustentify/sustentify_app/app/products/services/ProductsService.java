package com.sustentify.sustentify_app.app.products.services;

import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.dtos.ProductFilterDto;
import com.sustentify.sustentify_app.app.products.dtos.ProductSummaryDto;
import com.sustentify.sustentify_app.app.products.dtos.RegisterProductDto;
import com.sustentify.sustentify_app.app.products.dtos.UpdateProductDto;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.entities.ProductImage;
import com.sustentify.sustentify_app.app.products.entities.ProductThumbnail;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import com.sustentify.sustentify_app.app.products.repositories.ProductsRepository;
import com.sustentify.sustentify_app.dtos.ResponseDto;
import com.sustentify.sustentify_app.utils.FileUploadUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final CloudinaryService cloudinaryService;

    public ProductsService(ProductsRepository productsRepository, CloudinaryService cloudinaryService) {
        this.productsRepository = productsRepository;
        this.cloudinaryService = cloudinaryService;
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

    public void uploadThumbnailImage(final Long productId, final MultipartFile file) {
        final Product product = findById(productId);

        String fileName = FileUploadUtil.getFileName(file.getOriginalFilename());
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
        final CloudinaryResponse response = this.cloudinaryService.upload(file, fileName);

        ProductThumbnail image = new ProductThumbnail();
        image.setProduct(product);
        image.setUrl(response.url());
        image.setPublicId(response.publicId());

        product.setThumbnail(image);
        this.productsRepository.save(product);
    }

    public void uploadImages(final Long productId, final MultipartFile[] files) {
        final Product product = findById(productId);

        for (MultipartFile file: files) {
            String fileName = FileUploadUtil.getFileName(file.getOriginalFilename());
            FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
            final CloudinaryResponse response = this.cloudinaryService.upload(file, fileName);

            ProductImage image = new ProductImage();
            image.setUrl(response.url());
            image.setPublicId(response.publicId());
            image.setProduct(product);

            product.addImage(image);
        }

        this.productsRepository.save(product);
    }

    public void deleteProductImage(Long productId, String publicId) {
        Product product = findById(productId);

        cloudinaryService.deleteImage(publicId);

        List<ProductImage> images = product.getImages();
        images.forEach(image -> {
            if (image.getPublicId().equals(publicId)) {
                product.getImages().remove(image);
            }
        });

        productsRepository.save(product);
    }

    public void deleteThumbnail(Long productId, String publicId) {
        Product product = findById(productId);

        cloudinaryService.deleteImage(publicId);

        product.setThumbnail(null);

        productsRepository.save(product);
    }
}
