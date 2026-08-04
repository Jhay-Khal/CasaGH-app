package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.dto.AuthResponse;
import com.casagh.casagh_backend.dto.LoginRequest;
import com.casagh.casagh_backend.dto.RegisterRequest;
import com.casagh.casagh_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("CasaGH Backend is running!");
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        boolean verified = authService.verifyOtp(request.get("phone"), request.get("code"));
        if (verified) {
            return ResponseEntity.ok("Phone verified successfully!");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP code.");
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        boolean verified = authService.verifyEmail(token);
        String html;
        if (verified) {
            html = "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>"
                    + "<h1 style='color:green;'>Email Verified!</h1>"
                    + "<p>Your CasaGH account is now verified. You can go back to the app and log in.</p>"
                    + "</body></html>";
        } else {
            html = "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>"
                    + "<h1 style='color:red;'>Verification Failed</h1>"
                    + "<p>This link is invalid or has already been used.</p>"
                    + "</body></html>";
        }
        return ResponseEntity.ok().header("Content-Type", "text/html").body(html);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            authService.forgotPassword(request.get("email"));
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        } catch (RuntimeException e) {
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> showResetForm(@RequestParam String token) {
        String html = "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>"
                + "<h1>Reset Your Password</h1>"
                + "<form method='POST' action='/api/auth/reset-password'>"
                + "<input type='hidden' name='token' value='" + token + "'/>"
                + "<input type='password' name='newPassword' placeholder='Enter new password' required minlength='6' style='padding:10px;width:250px;'/><br/><br/>"
                + "<button type='submit' style='padding:10px 20px;'>Reset Password</button>"
                + "</form>"
                + "</body></html>";
        return ResponseEntity.ok().header("Content-Type", "text/html").body(html);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> submitResetForm(@RequestParam String token, @RequestParam String newPassword) {
        boolean success = authService.resetPassword(token, newPassword);
        String html;
        if (success) {
            html = "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>"
                    + "<h1 style='color:green;'>Password Reset!</h1>"
                    + "<p>Your password has been changed. You can go back to the app and log in with your new password.</p>"
                    + "</body></html>";
        } else {
            html = "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>"
                    + "<h1 style='color:red;'>Reset Failed</h1>"
                    + "<p>This link is invalid or has expired. Please request a new password reset.</p>"
                    + "</body></html>";
        }
        return ResponseEntity.ok().header("Content-Type", "text/html").body(html);
    }
}