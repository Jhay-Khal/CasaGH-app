package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.dto.AuthResponse;
import com.casagh.casagh_backend.dto.RegisterRequest;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "USER");

        // Encrypt the password before saving
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Save to database
        userRepository.save(user);

        return new AuthResponse("Registration successful!", user.getEmail(), user.getRole());
    }
}