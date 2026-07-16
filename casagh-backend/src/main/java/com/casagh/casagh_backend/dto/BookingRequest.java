package com.casagh.casagh_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long propertyId;
    private Long userId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}