package com.sustentify.sustentify_app.app.Upload.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sustentify.sustentify_app.app.Upload.dtos.CloudinaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public CloudinaryResponse upload(MultipartFile file, String fileName) {
        try {
            final Map result = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "public_id", "sustentify/images/" + fileName
            ));
            final String url = (String) result.get("url");
            final String publicId = (String) result.get("public_id");

            return new CloudinaryResponse(publicId, url);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
