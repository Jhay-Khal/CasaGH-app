package com.casagh.casagh_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PropertyRequest {
    private String title;
    private String description;
    private String type;
    private BigDecimal price;
    private Boolean isForRent;
    private String region;
    private String city;
    private String area;
    private Double latitude;
    private Double longitude;
    private Long ownerId;
}