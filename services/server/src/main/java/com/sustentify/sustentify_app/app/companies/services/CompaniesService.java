package com.sustentify.sustentify_app.app.companies.services;

import com.sustentify.sustentify_app.app.companies.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.UpdateCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.ValidateCompanyDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDeleted;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDocumentImage;
import com.sustentify.sustentify_app.app.companies.enums.Validation;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesDeletedRepository;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesRepository;
import com.sustentify.sustentify_app.app.emails.EmailTemplate;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import com.sustentify.sustentify_app.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;

import java.util.Objects;
import java.util.Optional;

@Service
public class CompaniesService {
    @Value("${spring.mail.username}")
    private String sender;
    private final CompaniesRepository companiesRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompaniesDeletedRepository companiesDeletedRepository;
    private final CloudinaryService cloudinaryService;
    private final EmailsService emailsService;

    public CompaniesService(CompaniesRepository companiesRepository, PasswordEncoder passwordEncoder, CompaniesDeletedRepository companiesDeletedRepository, CloudinaryService cloudinaryService, EmailsService emailsService) {
        this.companiesRepository = companiesRepository;
        this.passwordEncoder = passwordEncoder;
        this.companiesDeletedRepository = companiesDeletedRepository;
        this.cloudinaryService = cloudinaryService;
        this.emailsService = emailsService;
    }

    // Finds a company by its email.
    public Optional<Company> findByEmail(String email) {
        return this.companiesRepository.findByEmail(email);
    }

    // Checks if the email or CNPJ is already registered in the database.
    public boolean isEmailOrCnpjAlreadyRegistered(String email, String cnpj) {
        return companiesRepository.findByEmail(email).isPresent()
                || companiesRepository.findByCnpj(cnpj).isPresent();
    }

    // Finds a company by its ID.
    public Optional<Company> findById(String companyId) { return this.companiesRepository.findById(companyId); }

    // Creates a new company, uploads its document, sends validation email, and saves it.
    @Transactional
    public Company create(RegisterCompanyDto registerCompanyDto, MultipartFile file) {

        boolean exists = isEmailOrCnpjAlreadyRegistered(registerCompanyDto.email(), registerCompanyDto.cnpj());
        if (exists) throw new CompanyAlreadyExistsException();

        Company newCompany = new Company();
        newCompany.setPassword(passwordEncoder.encode(registerCompanyDto.password()));
        newCompany.setEmail(registerCompanyDto.email());
        newCompany.setName(registerCompanyDto.name());
        newCompany.setAddress(registerCompanyDto.address());
        newCompany.setCompanyDepartment(registerCompanyDto.companyDepartment());
        newCompany.setCnpj(registerCompanyDto.cnpj());
        newCompany.setPhone(registerCompanyDto.phone());
        newCompany.setValidation(Validation.PROGRESS);

        this.companiesRepository.save(newCompany);

        CompanyDocumentImage document = uploadDocumentImage(file);

        newCompany.setDocument(document);
        document.setCompany(newCompany);

        Company savedCompany = this.companiesRepository.save(newCompany);

        sendEmailValidation(savedCompany, file);

        return savedCompany;
    }

    // Uploads the company's document image to cloud storage.
    public CompanyDocumentImage uploadDocumentImage(MultipartFile file) {
        FileUploadUtil.assertAllowed(file);

        String fileName = FileUploadUtil.getFileName(Objects.requireNonNull(file.getOriginalFilename()));
        final CloudinaryResponse response = this.cloudinaryService.upload(file, fileName, "docs");

        CompanyDocumentImage documentImage = new CompanyDocumentImage();
        documentImage.setUrl(response.url());
        documentImage.setPublicId(response.publicId());

        return documentImage;
    }

    // Sends a validation email with the attached document to the admin.
    public void sendEmailValidation(Company company, MultipartFile file) {
        Context context = new Context();
        context.setVariable("company", company);
        this.emailsService.sendEmail("Nova Documentação Inserida - " + company.getName(), sender, EmailTemplate.VALIDATION_COMPANY, context, Optional.of(file));
    }

    // Deletes the company's document image from both the company and cloud storage.
    public void deleteDocumentImage(Company company, String publicId) {
        cloudinaryService.deleteImage(publicId);

        company.setDocument(null);
    }

    // Updates company information based on the provided DTO.
    @Transactional
    public Company update(Company company, UpdateCompanyDto updateCompanyDto) {

        applyUpdates(company, updateCompanyDto);

        return this.companiesRepository.save(company);
    }

    // Updates the company's password with a hashed version.
    @Transactional
    public void updatePassword(Company company, String password) {
        String hashedPassword = this.passwordEncoder.encode(password);

        company.setPassword(hashedPassword);

        this.save(company);
    }

    // Deletes the company and stores a backup of its data in the deleted companies repository.
    public void delete(Company company) {
        CompanyDeleted companyDeleted = new CompanyDeleted(company);
        this.companiesDeletedRepository.save(companyDeleted);

        if (company.getDocument() != null) {
            this.deleteDocumentImage(company, company.getDocument().getPublicId());
        }

        this.companiesRepository.delete(company);
    }

    // Updates the company's validation status (e.g., PROGRESS, CANCELLED, ACCEPTED).
    @Transactional
    public void validateCompany(Company company, ValidateCompanyDto validation) {
        company.setValidation(validation.validation());

        this.save(company);
    }

    // Applies the update DTO values to the company if they are not null.
    private void applyUpdates(Company company, UpdateCompanyDto dto) {
        if (dto.name() != null) company.setName(dto.name());
        if (dto.address() != null) company.setAddress(dto.address());
        if (dto.companyDepartment() != null) company.setCompanyDepartment(dto.companyDepartment());
        if (dto.phone() != null) company.setPhone(dto.phone());
    }

    // Saves the current state of the company to the database.
    public void save(Company company) {
        this.companiesRepository.save(company);
    }
}
