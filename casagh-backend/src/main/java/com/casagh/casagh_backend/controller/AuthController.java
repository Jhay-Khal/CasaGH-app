package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.dto.AuthResponse;
import com.casagh.casagh_backend.dto.RegisterRequest;
import com.casagh.casagh_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // REGISTER endpoint
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // Health check - test if API is working
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("CasaGH API is running!");
    }
}