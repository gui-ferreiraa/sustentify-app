package com.sustentify.sustentify_app.app.upload.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sustentify.sustentify_app.app.upload.dtos.CloudinaryResponse;
import com.sustentify.sustentify_app.app.upload.exceptions.UploadInvalidException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
        } catch (Exception e) {
            throw new UploadInvalidException("Error while uploading image");
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            e.printStackTrace();
            throw new UploadInvalidException("Error while deleting image");
        }
    }
}
