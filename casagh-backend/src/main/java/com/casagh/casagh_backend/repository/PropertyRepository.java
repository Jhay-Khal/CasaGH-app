package com.casagh.casagh_backend.repository;

import com.casagh.casagh_backend.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByVerificationStatus(String verificationStatus);
    List<Property> findByIsActiveTrue();

    // NEW — paginated versions
    Page<Property> findByIsActiveTrue(Pageable pageable);
    Page<Property> findByCity(String city, Pageable pageable);
    Page<Property> findByType(String type, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.isActive = true " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:isForRent IS NULL OR p.isForRent = :isForRent) " +
            "AND (:region IS NULL OR p.region = :region) " +
            "AND (:city IS NULL OR p.city = :city) " +
            "AND (:type IS NULL OR p.type = :type)")
    List<Property> searchProperties(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("isForRent") Boolean isForRent,
            @Param("region") String region,
            @Param("city") String city,
            @Param("type") String type
    );
}