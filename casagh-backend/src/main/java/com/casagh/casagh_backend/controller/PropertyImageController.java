package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.PropertyImage;
import com.casagh.casagh_backend.service.PropertyImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyImageController {

    private final PropertyImageService propertyImageService;

    // POST /api/images/{propertyId}
    @PostMapping("/{propertyId}")
    public ResponseEntity<PropertyImage> uploadImage(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(propertyImageService.uploadImage(propertyId, file));
    }

    // GET /api/images/{propertyId}
    @GetMapping("/{propertyId}")
    public ResponseEntity<List<PropertyImage>> getPropertyImages(
            @PathVariable Long propertyId) {
        return ResponseEntity.ok(propertyImageService.getPropertyImages(propertyId));
    }

    // DELETE /api/images/{imageId}
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable Long imageId) {
        propertyImageService.deleteImage(imageId);
        return ResponseEntity.ok(Map.of("status", "Image deleted"));
    }
}