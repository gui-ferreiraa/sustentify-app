package com.sustentify.sustentify_app.app;

import com.sustentify.sustentify_app.app.companies.dtos.RegisterCompanyDto;
import com.sustentify.sustentify_app.app.companies.dtos.UpdateCompanyDto;
import com.sustentify.sustentify_app.app.companies.entities.Company;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDeleted;
import com.sustentify.sustentify_app.app.companies.entities.CompanyDocumentImage;
import com.sustentify.sustentify_app.app.companies.enums.CompanyDepartment;
import com.sustentify.sustentify_app.app.companies.exceptions.CompanyAlreadyExistsException;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesDeletedRepository;
import com.sustentify.sustentify_app.app.companies.repositories.CompaniesRepository;
import com.sustentify.sustentify_app.app.companies.services.CompaniesService;
import com.sustentify.sustentify_app.app.emails.EmailsService;
import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.exceptions.UploadInvalidException;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class CompaniesServiceTests {

    @Mock
    private CompaniesRepository companiesRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CompaniesDeletedRepository companiesDeletedRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private EmailsService emailsService;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private CompaniesService companiesService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(companiesService, "sender", "test@sustentify.com");
    }

    @Test
    void shouldThrowExceptionWhenUploadInvalidException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image",
                MediaType.IMAGE_JPEG_VALUE,
                "imagem qualquer".getBytes()
        );
        RegisterCompanyDto dto = new RegisterCompanyDto(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );

        Mockito.when(companiesRepository.findByEmail(dto.email())).thenReturn(Optional.empty());
        Mockito.when(companiesRepository.findByCnpj(dto.cnpj())).thenReturn(Optional.empty());

        Mockito.when(passwordEncoder.encode(dto.password())).thenReturn("encoded-password");

        Assertions.assertThrows(UploadInvalidException.class, () -> {
            companiesService.create(dto, file);
        });
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        RegisterCompanyDto dto = new RegisterCompanyDto(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );

        Mockito.when(companiesRepository.findByEmail(dto.email())).thenReturn(Optional.of(new Company()));

        Assertions.assertThrows(CompanyAlreadyExistsException.class, () -> {
            companiesService.create(dto, multipartFile);
        });
    }

    @Test
    void shouldThrowExceptionWhenCnpjAlreadyExists() {
        RegisterCompanyDto dto = new RegisterCompanyDto(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );

        Mockito.when(companiesRepository.findByCnpj(dto.cnpj())).thenReturn(Optional.of(new Company()));

        Assertions.assertThrows(CompanyAlreadyExistsException.class, () -> {
            companiesService.create(dto, multipartFile);
        });
    }

    @Test
    void shouldCreateSuccessfully() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "imagem qualquer".getBytes()
        );
        RegisterCompanyDto dto = new RegisterCompanyDto(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );

        Mockito.when(companiesRepository.findByEmail(dto.email())).thenReturn(Optional.empty());
        Mockito.when(companiesRepository.findByCnpj(dto.cnpj())).thenReturn(Optional.empty());

        Mockito.when(passwordEncoder.encode(dto.password())).thenReturn("encoded-password");

        CloudinaryResponse cloudinaryResponse = new CloudinaryResponse("http://url", "publicId123");
        Mockito.when(cloudinaryService.upload(Mockito.any(MultipartFile.class), Mockito.anyString(), Mockito.eq("docs")))
                .thenReturn(cloudinaryResponse);

        Mockito.when(companiesRepository.save(Mockito.any(Company.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // retorna o mesmo objeto salvo

        Company createdCompany = companiesService.create(dto, file);

        Assertions.assertNotNull(createdCompany);
        Assertions.assertEquals("Empresa Sustentável", createdCompany.getName());
        Assertions.assertEquals("encoded-password", createdCompany.getPassword());
        Assertions.assertNotNull(createdCompany.getDocument());
        Assertions.assertEquals("publicId123", createdCompany.getDocument().getUrl());

        Mockito.verify(companiesRepository, Mockito.times(2)).save(Mockito.any(Company.class));
        Mockito.verify(emailsService, Mockito.times(1)).sendEmail(Mockito.anyString(), Mockito.anyString(), Mockito.any(), Mockito.any(), Mockito.any());
    }

    @Test
    public void shouldDeleteSuccessfully() {
        Company company = new Company(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );
        company.setId("test-id");

        companiesService.delete(company);

        Mockito.verify(cloudinaryService, Mockito.times(0)).deleteImage("test-id");
        Mockito.verify(companiesRepository, Mockito.times(1)).delete(company);

        ArgumentCaptor<CompanyDeleted> captor = ArgumentCaptor.forClass(CompanyDeleted.class);
        Mockito.verify(companiesDeletedRepository, Mockito.times(1)).save(captor.capture());

        CompanyDeleted saved = captor.getValue();
        Assertions.assertEquals(company.getName(), saved.getName());
        Assertions.assertEquals(company.getEmail(), saved.getEmail());
    }

    @Test
    public void shouldDeleteWithDocumentSuccessfully() {
        Company company = new Company(
                "Empresa Sustentável", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT
        );
        company.setId("test-id");

        CompanyDocumentImage documentImage = new CompanyDocumentImage("publicid", "http://url", company);

        company.setDocument(documentImage);

        Mockito.doNothing().when(cloudinaryService).deleteImage(documentImage.getPublicId());

        companiesService.delete(company);

        Mockito.verify(cloudinaryService, Mockito.times(1)).deleteImage(documentImage.getPublicId());
        Mockito.verify(companiesRepository, Mockito.times(1)).delete(company);

        ArgumentCaptor<CompanyDeleted> captor = ArgumentCaptor.forClass(CompanyDeleted.class);
        Mockito.verify(companiesDeletedRepository, Mockito.times(1)).save(captor.capture());

        CompanyDeleted saved = captor.getValue();
        Assertions.assertEquals(company.getName(), saved.getName());
        Assertions.assertEquals(company.getEmail(), saved.getEmail());
    }

    @Test
    public void shouldUpdateSuccessfully() {
        Company company = new Company(
                "Empresa Antiga", "empresa@email.com", "12345678000199",
                "123456", "Endereço Antigo", "11988888888", CompanyDepartment.ADMINISTRATIVE
        );
        company.setId("test-id");

        UpdateCompanyDto dto = new UpdateCompanyDto(
                "Empresa Sustentável", "Endereço Novo", CompanyDepartment.SUPPORT,
                "11999999999"
        );

        companiesService.update(company, dto);

        Assertions.assertEquals(dto.name(), company.getName());
        Assertions.assertEquals(dto.address(), company.getAddress());
        Assertions.assertEquals(dto.phone(), company.getPhone());
        Assertions.assertEquals(dto.companyDepartment(), company.getCompanyDepartment());

        Mockito.verify(companiesRepository, Mockito.times(1)).save(company);
    }

    @Test
    public void shouldFindByEmailNone() {
        Mockito.when(companiesRepository.findByEmail("empresa@email.com"))
                .thenReturn(Optional.empty());

        Optional<Company> result = companiesService.findByEmail("empresa@email.com");

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void shouldFindByEmailSuccessfully() {
        Company company = new Company("Empresa", "empresa@email.com", "12345678000199",
                "123456", "Endereço", "11999999999", CompanyDepartment.SUPPORT);
        company.setId("id-1");

        Mockito.when(companiesRepository.findByEmail("empresa@email.com"))
                .thenReturn(Optional.of(company));

        Optional<Company> result = companiesService.findByEmail("empresa@email.com");

        Assertions.assertTrue(result.isPresent());
        Assertions.assertEquals("id-1", result.get().getId());
        Assertions.assertEquals("Empresa", result.get().getName());
    }

    @Test
    public void shouldFindByEmailOrCnpjNone() {
        Mockito.when(companiesRepository.findByEmail("email@email.com"))
                .thenReturn(Optional.empty());

        boolean result = companiesService.isEmailOrCnpjAlreadyRegistered("email@email.com", "12345678000199");

        Assertions.assertFalse(result);
    }

    @Test
    public void shouldFindByEmailOrCnpjSuccesfully() {
        Mockito.when(companiesRepository.findByEmail("email@email.com"))
                .thenReturn(Optional.of(new Company()));

        boolean result = companiesService.isEmailOrCnpjAlreadyRegistered("email@email.com", "12345678000199");

        Assertions.assertTrue(result);
    }
    
    @Test
    public void shouldFindByCnpjSuccesfully() {
        Mockito.when(companiesRepository.findByCnpj("12345678000199"))
                .thenReturn(Optional.of(new Company()));

        boolean result = companiesService.isEmailOrCnpjAlreadyRegistered("", "12345678000199");

        Assertions.assertTrue(result);
    }

    @Test
    public void shouldFindByIdNone() {
        Company company = new Company();
        company.setId("123");

        Mockito.when(companiesRepository.findById(company.getId()))
                .thenReturn(Optional.empty());

        Optional<Company> result = companiesService.findById(company.getId());

        Assertions.assertEquals(Optional.empty(), result);
    }

    @Test
    public void shouldFindByIdSuccesfully() {
        Company company = new Company();
        company.setId("123");

        Mockito.when(companiesRepository.findById(company.getId()))
                .thenReturn(Optional.of(company));

        Optional<Company> result = companiesService.findById(company.getId());

        Assertions.assertEquals(company.getId(), result.get().getId());
    }
}