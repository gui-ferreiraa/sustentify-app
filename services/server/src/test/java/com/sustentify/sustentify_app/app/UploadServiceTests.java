package com.sustentify.sustentify_app.app;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.exceptions.UploadInvalidException;
import com.sustentify.sustentify_app.app.upload.services.CloudinaryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public class UploadServiceTests {
    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private CloudinaryService cloudinaryService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should upload is Successfully")
    public void uploadCase1() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file", "test-image.jpg", "image/jpeg", "fake-image-content".getBytes()
        );

        String filename = "test";
        String folder = "products";

        Map<String, String> uploadResult = Map.of(
                "url", "https://res.cloudinary.com/sustentify/products/test.jpg",
                "public_id", "sustentify/products/test"
        );

        Mockito.when(cloudinary.uploader()).thenReturn(uploader);
        Mockito.when(uploader.upload(
                Mockito.any(byte[].class),
                Mockito.anyMap()
        )).thenReturn(uploadResult);

        CloudinaryResponse response = cloudinaryService.upload(file, filename, folder);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("sustentify/products/test", response.publicId());
        Assertions.assertEquals("https://res.cloudinary.com/sustentify/products/test.jpg", response.url());

        Mockito.verify(uploader, Mockito.times(1))
                .upload(Mockito.any(byte[].class), Mockito.anyMap());
    }

    @Test
    @DisplayName("Should upload throws UploadInvalidException")
    void uploadCase2() throws Exception {
        MultipartFile file = new MockMultipartFile(
                "file", "test-image.jpg", "image/jpeg", "fake-image-content".getBytes()
        );

        Mockito.when(cloudinary.uploader()).thenReturn(uploader);
        Mockito.when(uploader.upload(Mockito.any(), Mockito.anyMap()))
                .thenThrow(new RuntimeException("Upload failed"));

        // Act & Assert
        UploadInvalidException exception = Assertions.assertThrows(UploadInvalidException.class, () ->
                cloudinaryService.upload(file, "test", "products")
        );

        Assertions.assertEquals("Error while uploading image", exception.getMessage());

        Mockito.verify(uploader, Mockito.times(1))
                .upload(Mockito.any(byte[].class), Mockito.anyMap());
    }

    @Test
    @DisplayName("Should delete is Successfully")
    void deleteCase1() throws Exception {
        Mockito.when(cloudinary.uploader()).thenReturn(uploader);

        Mockito.when(uploader.destroy(Mockito.anyString(), Mockito.anyMap()))
                .thenReturn(Map.of("result", "ok"));

        cloudinaryService.deleteImage("sustentify/products/test");

        Mockito.verify(uploader, Mockito.times(1))
                .destroy(Mockito.eq("sustentify/products/test"), Mockito.anyMap());
    }

    @Test
    @DisplayName("Should delete throws UploadInvalidException")
    void deleteCase2() throws Exception {
        Mockito.when(cloudinary.uploader()).thenReturn(uploader);
        Mockito.when(uploader.destroy(Mockito.anyString(), Mockito.anyMap()))
                .thenThrow(new RuntimeException("Delete failed"));

        UploadInvalidException exception = Assertions.assertThrows(UploadInvalidException.class, () ->
                cloudinaryService.deleteImage("sustentify/products/test")
        );

        Assertions.assertEquals("Error while deleting image", exception.getMessage());

        Mockito.verify(uploader, Mockito.times(1))
                .destroy(Mockito.eq("sustentify/products/test"), Mockito.anyMap());
    }
}
