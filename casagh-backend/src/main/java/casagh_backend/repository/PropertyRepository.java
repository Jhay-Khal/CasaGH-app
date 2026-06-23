package com.casagh.casagh_backend.repository;

import com.casagh.casagh_backend.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByIsVerifiedTrue();
    List<Property> findByIsActiveTrue();
    List<Property> findByCityAndType(String city, String type);
    List<Property> findByRegion(String region);
    List<Property> findByIsForRentTrue();
}