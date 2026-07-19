package com.casagh.casagh_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

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

    // Listing fee fields
    @Column(name = "listing_fee_paid")
    private Boolean listingFeePaid = false;

    @Column(name = "listing_payment_reference")
    private String listingPaymentReference;

    @Column(name = "listing_paid_at")
    private LocalDateTime listingPaidAt;

    @Column(name = "listing_expiry_date")
    private LocalDateTime listingExpiryDate;

    // Document verification
    @Column(name = "document_url")
    private String documentUrl;

    // Type-specific listing details
    @Column(name = "room_type")
    private String roomType;

    @Column(name = "pricing_unit")
    private String pricingUnit = "NIGHT";

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();
}