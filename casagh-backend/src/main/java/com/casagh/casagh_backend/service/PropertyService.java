package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.dto.PropertyRequest;
import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public Property createProperty(PropertyRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found!"));

        Property property = new Property();
        property.setOwner(owner);
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setType(request.getType());
        property.setPrice(request.getPrice());
        property.setIsForRent(request.getIsForRent());
        property.setRegion(request.getRegion());
        property.setCity(request.getCity());
        property.setArea(request.getArea());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());

        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findByIsActiveTrue();
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    public List<Property> getPropertiesByType(String type) {
        return propertyRepository.findByType(type);
    }

    public List<Property> getVerifiedProperties() {
        return propertyRepository.findByIsVerifiedTrue();
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Property updateProperty(Long id, PropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setType(request.getType());
        property.setPrice(request.getPrice());
        property.setIsForRent(request.getIsForRent());
        property.setRegion(request.getRegion());
        property.setCity(request.getCity());
        property.setArea(request.getArea());

        return propertyRepository.save(property);
    }
}