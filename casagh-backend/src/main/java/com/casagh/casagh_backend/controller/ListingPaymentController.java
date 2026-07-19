package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.service.PaystackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/listing-payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ListingPaymentController {

    private final PaystackService paystackService;
    private final PropertyRepository propertyRepository;

    private static final BigDecimal LISTING_FEE = new BigDecimal("50.00");

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateListingPayment(@RequestBody Map<String, Object> request) {
        Long propertyId = Long.valueOf(request.get("propertyId").toString());
        String email = request.get("email").toString();

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        String reference = "listing_" + propertyId + "_" + UUID.randomUUID().toString().substring(0, 8);

        property.setListingPaymentReference(reference);
        property.setListingPaidAt(LocalDateTime.now());
        propertyRepository.save(property);

        Map<String, Object> paystackResponse = paystackService.initializeTransaction(
                email, LISTING_FEE, reference);

        Map<String, Object> data = (Map<String, Object>) paystackResponse.get("data");
        return ResponseEntity.ok(Map.of(
                "authorizationUrl", data.get("authorization_url"),
                "reference", reference
        ));
    }

    @GetMapping("/verify/{reference}")
    public ResponseEntity<?> verifyListingPayment(@PathVariable String reference) {
        Map<String, Object> verification = paystackService.verifyTransaction(reference);
        Map<String, Object> data = (Map<String, Object>) verification.get("data");
        String status = (String) data.get("status");

        if (!"success".equals(status)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment not successful"));
        }

        propertyRepository.findByListingPaymentReference(reference).ifPresent(property -> {
            property.setListingFeePaid(true);
            property.setListingExpiryDate(LocalDateTime.now().plusMonths(1));
            propertyRepository.save(property);
        });

        return ResponseEntity.ok(Map.of("message", "Listing payment verified successfully"));
    }
}