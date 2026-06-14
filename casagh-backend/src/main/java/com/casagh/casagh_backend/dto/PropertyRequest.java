package com.casagh.casagh_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "isForRent is required")
    private Boolean isForRent;

    @NotBlank(message = "Region is required")
    private String region;

    @NotBlank(message = "City is required")
    private String city;

    private String area;
    private Double latitude;
    private Double longitude;
    private Long ownerId;
}