package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.PropertyImage;
import com.casagh.casagh_backend.repository.PropertyImageRepository;
import com.casagh.casagh_backend.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PropertyImage uploadImage(Long propertyId, MultipartFile file) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        PropertyImage image = new PropertyImage();
        image.setProperty(property);
        image.setImageUrl("/uploads/" + filename);
        return propertyImageRepository.save(image);
    }

    public List<PropertyImage> getPropertyImages(Long propertyId) {
        return propertyImageRepository.findByPropertyId(propertyId);
    }

    public void deleteImage(Long imageId) {
        propertyImageRepository.deleteById(imageId);
    }
}