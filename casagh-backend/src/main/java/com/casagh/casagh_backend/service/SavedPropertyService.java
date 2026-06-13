package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.SavedProperty;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.SavedPropertyRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPropertyService {

    private final SavedPropertyRepository savedPropertyRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public SavedProperty saveProperty(Long userId, Long propertyId) {
        if (savedPropertyRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            throw new RuntimeException("Property already saved!");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        SavedProperty saved = new SavedProperty();
        saved.setUser(user);
        saved.setProperty(property);
        return savedPropertyRepository.save(saved);
    }

    public List<SavedProperty> getUserSavedProperties(Long userId) {
        return savedPropertyRepository.findByUserId(userId);
    }

    @Transactional
    public void unsaveProperty(Long userId, Long propertyId) {
        savedPropertyRepository.deleteByUserIdAndPropertyId(userId, propertyId);
    }
}