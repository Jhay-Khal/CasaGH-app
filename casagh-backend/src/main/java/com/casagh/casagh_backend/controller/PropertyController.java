package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllActiveProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Property>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(propertyService.getPropertiesByCity(city));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(propertyService.getPropertiesByType(type));
    }

    @GetMapping("/verified")
    public ResponseEntity<List<Property>> getVerifiedProperties() {
        return ResponseEntity.ok(propertyService.getVerifiedProperties());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Property>> getPendingProperties() {
        return ResponseEntity.ok(propertyService.getPendingProperties());
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        return ResponseEntity.ok(propertyService.createProperty(property));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id,
                                                   @RequestBody Property property) {
        return ResponseEntity.ok(propertyService.updateProperty(id, property));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(Map.of("status", "Property deleted"));
    }


    // ─── Admin Verification ───────────────────────────────────

    @PutMapping("/{id}/approve")
    public ResponseEntity<Property> approveProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.approveProperty(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Property> rejectProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.rejectProperty(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isForRent,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(propertyService.searchProperties(
                minPrice, maxPrice, isForRent, region, city, type));
    }
}