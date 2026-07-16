package com.casagh.casagh_backend.repository;

import com.casagh.casagh_backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByPropertyId(Long propertyId);
    Optional<Booking> findByPaymentReference(String paymentReference);
}