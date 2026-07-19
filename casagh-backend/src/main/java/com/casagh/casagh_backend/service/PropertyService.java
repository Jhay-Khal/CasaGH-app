package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public List<Property> getAllActiveProperties() {
        return propertyRepository.findByIsActiveTrueAndVerificationStatus("APPROVED");
    }

    public Page<Property> getAllActivePropertiesPaged(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return propertyRepository.findByIsActiveTrueAndVerificationStatus("APPROVED", pageable);
    }

    public Page<Property> getPropertiesByCityPaged(String city, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return propertyRepository.findByCityAndIsActiveTrueAndVerificationStatus(city, "APPROVED", pageable);
    }

    public Page<Property> getPropertiesByTypePaged(String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return propertyRepository.findByTypeAndIsActiveTrueAndVerificationStatus(type, "APPROVED", pageable);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    public List<Property> getPropertiesByType(String type) {
        return propertyRepository.findByType(type);
    }

    public List<Property> getVerifiedProperties() {
        return propertyRepository.findByVerificationStatus("APPROVED");
    }

    public List<Property> getPendingProperties() {
        return propertyRepository.findByVerificationStatus("PENDING");
    }

    public Property createProperty(Property property) {
        property.setVerificationStatus("PENDING");
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        Property property = getPropertyById(id);
        property.setTitle(updatedProperty.getTitle());
        property.setDescription(updatedProperty.getDescription());
        property.setType(updatedProperty.getType());
        property.setPrice(updatedProperty.getPrice());
        property.setCity(updatedProperty.getCity());
        property.setRegion(updatedProperty.getRegion());
        property.setArea(updatedProperty.getArea());
        property.setIsForRent(updatedProperty.getIsForRent());
        if (updatedProperty.getDocumentUrl() != null) {
            property.setDocumentUrl(updatedProperty.getDocumentUrl());
        }
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Property approveProperty(Long propertyId) {
        Property property = getPropertyById(propertyId);
        property.setVerificationStatus("APPROVED");
        Property saved = propertyRepository.save(property);

        User owner = property.getOwner();
        if (owner != null) {
            notificationService.createNotification(
                    owner,
                    "PROPERTY_APPROVED",
                    "Your property \"" + property.getTitle() + "\" has been approved and is now live!",
                    property.getId(),
                    null
            );
        }

        return saved;
    }

    public Property rejectProperty(Long propertyId) {
        Property property = getPropertyById(propertyId);
        property.setVerificationStatus("REJECTED");
        Property saved = propertyRepository.save(property);

        User owner = property.getOwner();
        if (owner != null) {
            notificationService.createNotification(
                    owner,
                    "PROPERTY_REJECTED",
                    "Your property \"" + property.getTitle() + "\" was not approved. Please contact support.",
                    property.getId(),
                    null
            );
        }

        return saved;
    }

    public List<Property> searchProperties(BigDecimal minPrice, BigDecimal maxPrice,
                                           Boolean isForRent, String region,
                                           String city, String type) {
        return propertyRepository.searchProperties(minPrice, maxPrice, isForRent, region, city, type);
    }

    public Page<Property> getPropertiesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return propertyRepository.findByIsActiveTrueAndVerificationStatus("APPROVED", pageable);
    }
}