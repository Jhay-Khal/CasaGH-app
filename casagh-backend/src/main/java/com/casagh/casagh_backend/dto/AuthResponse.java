package com.casagh.casagh_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private Long id;
    private String email;
    private String role;
    private String token;
}