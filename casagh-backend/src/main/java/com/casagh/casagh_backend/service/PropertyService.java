package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public List<Property> getAllProperties() {
        return propertyRepository.findByIsActiveTrue();
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    public List<Property> getPropertiesByType(String type) {
        return propertyRepository.findByType(type);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public Property saveProperty(Property property) {
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public List<Property> getVerifiedProperties() {
        return propertyRepository.findByIsVerifiedTrue();
    }
}