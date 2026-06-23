package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.SavedProperty;
import com.casagh.casagh_backend.service.SavedPropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SavedPropertyController {

    private final SavedPropertyService savedPropertyService;

    // Save a property
    @PostMapping("/{userId}/{propertyId}")
    public ResponseEntity<SavedProperty> saveProperty(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        return ResponseEntity.ok(savedPropertyService.saveProperty(userId, propertyId));
    }

    // Get all saved properties for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<SavedProperty>> getSaved(@PathVariable Long userId) {
        return ResponseEntity.ok(savedPropertyService.getUserSavedProperties(userId));
    }

    // Remove a saved property
    @DeleteMapping("/{userId}/{propertyId}")
    public ResponseEntity<String> unsaveProperty(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        savedPropertyService.unsaveProperty(userId, propertyId);
        return ResponseEntity.ok("Property removed from saved list!");
    }
}