package com.casagh.casagh_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Double totalPrice;

    // Commission fields
    private Double commissionRate;    // e.g. 7.0 (percent)
    private Double commissionAmount;  // e.g. 70.0 (GHS)
    private Double landlordAmount;    // e.g. 930.0 (GHS)

    private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED

    private String paymentReference;

    private LocalDateTime createdAt = LocalDateTime.now();
}