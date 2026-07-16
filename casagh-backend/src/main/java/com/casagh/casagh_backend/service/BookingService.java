package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.dto.BookingRequest;
import com.casagh.casagh_backend.model.Booking;
import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.BookingRepository;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public Booking createBooking(BookingRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (request.getCheckOutDate().isBefore(request.getCheckInDate()) ||
                request.getCheckOutDate().isEqual(request.getCheckInDate())) {
            throw new RuntimeException("Check-out date must be after check-in date!");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = property.getPrice().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setUser(user);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalPrice(totalPrice.doubleValue());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    public Booking confirmBooking(String paymentReference) {
        Booking booking = bookingRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Booking not found for this payment reference!"));
        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    public Booking attachPaymentReference(Long bookingId, String paymentReference) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
        booking.setPaymentReference(paymentReference);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
    }
}