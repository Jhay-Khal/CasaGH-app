package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.config.JwtUtil;
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
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "USER");
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse("Registration successful!", user.getEmail(), user.getRole(), token);
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password!");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse("Login successful!", user.getEmail(), user.getRole(), token);
    }
}