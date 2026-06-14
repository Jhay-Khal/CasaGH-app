package com.casagh.casagh_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String type;

    private BigDecimal price;

    @Column(name = "is_for_rent")
    private Boolean isForRent = true;

    @Column(name = "verification_status")
    private String verificationStatus = "PENDING";

    @Column(name = "is_active")
    private Boolean isActive = true;

    private String region;
    private String city;
    private String area;
    private Double latitude;
    private Double longitude;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}