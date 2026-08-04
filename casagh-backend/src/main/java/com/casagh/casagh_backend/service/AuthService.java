package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.config.JwtUtil;
import com.casagh.casagh_backend.dto.AuthResponse;
import com.casagh.casagh_backend.dto.RegisterRequest;
import com.casagh.casagh_backend.dto.LoginRequest;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.casagh.casagh_backend.service.OtpService;
import com.casagh.casagh_backend.service.EmailService;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final EmailService emailService;

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
        otpService.sendOtp(user.getPhone());

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse("Registration successful!", user.getId(), user.getEmail(), user.getRole(), token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password!");
        }
        
        if (!user.getEmailVerified()) {
        throw new RuntimeException("Please verify your email before logging in.");
        }
        
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse("Login successful!", user.getId(), user.getEmail(), user.getRole(), token);
    }
    
        public boolean verifyOtp(String phone, String code) {
        boolean isValid = otpService.verifyOtp(phone, code);
        if (isValid) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        user.setIsVerified(true);
        userRepository.save(user);
        return true;
    }
    return false;
    }

         public boolean verifyEmail(String token) {
         User user = userRepository.findByVerificationToken(token)
                  .orElse(null);
         if (user == null) {
         return false;
    }
         user.setEmailVerified(true);
         user.setVerificationToken(null);
         userRepository.save(user);
         return true;
}

        public void forgotPassword(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No account found with that email."));

    String resetToken = UUID.randomUUID().toString();
    user.setResetToken(resetToken);
    user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
    userRepository.save(user);

    emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
}

    public boolean resetPassword(String token, String newPassword) {
    User user = userRepository.findByResetToken(token).orElse(null);
    if (user == null) {
        return false;
    }
    if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
        return false;
    }
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);
    userRepository.save(user);
    return true;
}
}