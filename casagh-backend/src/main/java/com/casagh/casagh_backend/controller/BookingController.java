package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.dto.BookingRequest;
import com.casagh.casagh_backend.model.Booking;
import com.casagh.casagh_backend.service.BookingService;
import com.casagh.casagh_backend.service.PaystackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final PaystackService paystackService;

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    // Starts a Paystack payment for an existing booking, returns a checkout URL
    @PostMapping("/{id}/pay")
    public Map<String, Object> initiatePayment(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);

        String reference = "casagh_" + UUID.randomUUID().toString().replace("-", "");
        bookingService.attachPaymentReference(id, reference);

        Map<String, Object> paystackResponse = paystackService.initializeTransaction(
                booking.getUser().getEmail(),
                BigDecimal.valueOf(booking.getTotalPrice()),
                reference
        );

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> data = (Map<String, Object>) paystackResponse.get("data");
        result.put("authorizationUrl", data.get("authorization_url"));
        result.put("reference", reference);
        return result;
    }

    // Called after the user completes payment, verifies with Paystack and confirms the booking
    @GetMapping("/verify/{reference}")
    public Map<String, Object> verifyPayment(@PathVariable String reference) {
        Map<String, Object> paystackResponse = paystackService.verifyTransaction(reference);
        Map<String, Object> data = (Map<String, Object>) paystackResponse.get("data");
        String status = (String) data.get("status");

        Map<String, Object> result = new HashMap<>();
        if ("success".equals(status)) {
            Booking booking = bookingService.confirmBooking(reference);
            result.put("verified", true);
            result.put("booking", booking);
        } else {
            result.put("verified", false);
        }
        return result;
    }
}