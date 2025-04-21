package com.sustentify.sustentify_app.app.products.services;

import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.products.dtos.*;
import com.sustentify.sustentify_app.app.products.entities.Product;
import com.sustentify.sustentify_app.app.products.entities.ProductImage;
import com.sustentify.sustentify_app.app.products.entities.ProductThumbnail;
import com.sustentify.sustentify_app.app.products.exceptions.ProductInvalidException;
import com.sustentify.sustentify_app.app.products.exceptions.ProductNotFoundException;
import com.sustentify.sustentify_app.app.products.repositories.ProductsRepository;
import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import com.sustentify.sustentify_app.utils.FileUploadUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Transactional
@Service
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final CloudinaryService cloudinaryService;

    public ProductsService(ProductsRepository productsRepository, CloudinaryService cloudinaryService) {
        this.productsRepository = productsRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional(readOnly = true)
    public Product findById(String productId) { return this.productsRepository.findById(productId).orElseThrow(ProductNotFoundException::new); }

    @Transactional(readOnly = true)
    public Product findByIdAndCompany(String productId, Company company) { return this.productsRepository.findByIdAndCompany(productId, company).orElseThrow(ProductNotFoundException::new);}

    public Product create(RegisterProductDto registerProductDto, Company company) {
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

        return  this.productsRepository.save(newProduct);
    }

    public Page<ProductSummaryDto> findAllFiltered(int page, int size, ProductFilterDto filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Specification<Product> specification = filter.toSpecification();

        return this.productsRepository.findAll(specification, pageable).map(ProductSummaryDto::new);
    }

    public Page<Product> getProductsByCompany(Company company, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return this.productsRepository.findByCompany(company, pageable);
    }

    public Page<ProductSummaryDto> findTrendingProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").descending());

        return this.productsRepository.findTopByInterestCount(pageable).map(ProductSummaryDto::new);
    }

    public Product update(Product product, UpdateProductDto updateProductDto) {

        applyUpdate(product, updateProductDto);

        return this.productsRepository.save(product);
    }

    private void applyUpdate(Product product, UpdateProductDto dto) {
        if (dto.name() != null) product.setName(dto.name());
        if (dto.description() != null) product.setDescription(dto.description());
        if (dto.price() != null) product.setPrice(dto.price());
        if (dto.category() != null) product.setCategory(dto.category());
        if (dto.location() != null) product.setLocation(dto.location());
        if (dto.condition() != null) product.setCondition(dto.condition());
        if (dto.material() != null) product.setMaterial(dto.material());
        if (dto.quantity() != null) product.setQuantity(dto.quantity());
    }

    public void delete(Product product) {

        if (product.getThumbnail() != null) {
            UploadDeleteDto dto = new UploadDeleteDto(product.getThumbnail().getPublicId());
            this.deleteThumbnail(product, dto);
        }

        if (!product.getImages().isEmpty()) {
            List<ProductImage> list = new ArrayList<>(product.getImages());

            for (ProductImage image : list) {
                this.deleteImage(product, new UploadDeleteDto(image.getPublicId()));
            }
        }

        this.productsRepository.delete(product);
    }

    public void uploadThumbnail(Product product, final MultipartFile file) {
        if (product.getThumbnail() != null) {
            UploadDeleteDto dto = new UploadDeleteDto(product.getThumbnail().getPublicId());
            this.deleteThumbnail(product, dto);
        }

        String fileName = FileUploadUtil.getFileName(Objects.requireNonNull(file.getOriginalFilename()));
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
        final CloudinaryResponse response = this.cloudinaryService.upload(file, fileName);

        ProductThumbnail image = new ProductThumbnail();
        image.setProduct(product);
        image.setUrl(response.url());
        image.setPublicId(response.publicId());

        product.setThumbnail(image);
        this.productsRepository.save(product);
    }

    public void uploadImages(Product product, final MultipartFile[] files) {

        if (product.getImages().size() >= 3) throw new ProductInvalidException("Too many images");
        if (files.length + product.getImages().size() > 3) throw new ProductInvalidException("More than three images");

        for (MultipartFile file: files) {
            String fileName = FileUploadUtil.getFileName(Objects.requireNonNull(file.getOriginalFilename()));
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

    public void deleteImage(Product product, UploadDeleteDto dto) {

        cloudinaryService.deleteImage(dto.publicId());

        product.getImages().removeIf(img -> img.getPublicId().equals(dto.publicId()));
    }

    public void deleteThumbnail(Product product, UploadDeleteDto dto) {

        cloudinaryService.deleteImage(dto.publicId());

        product.setThumbnail(null);
    }

    public void save(Product product) {
        this.productsRepository.save(product);
    }
}
