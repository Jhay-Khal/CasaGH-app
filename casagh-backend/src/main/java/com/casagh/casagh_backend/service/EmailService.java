package com.casagh.casagh_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String baseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String link = baseUrl + "/api/auth/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your CasaGH account");
        message.setText("Welcome to CasaGH!\n\nPlease verify your email by clicking the link below:\n\n"
                + link + "\n\nThis link will expire once used.\n\nIf you didn't sign up for CasaGH, you can ignore this email.");

        mailSender.send(message);
    }

   public void sendPasswordResetEmail(String toEmail, String token) {
        String link = baseUrl + "/api/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset your CasaGH password");
        message.setText("We received a request to reset your CasaGH password.\n\nClick the link below to set a new password:\n\n"
                + link + "\n\nThis link will expire in 30 minutes.\n\nIf you didn't request this, you can safely ignore this email.");

        mailSender.send(message);
    }
}