package com.casagh.casagh_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${app.frontend.url}")
    private String baseUrl;

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

    private void sendEmail(String toEmail, String subject, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(sendGridApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = Map.of(
                "personalizations", List.of(
                        Map.of("to", List.of(Map.of("email", toEmail)))
                ),
                "from", Map.of("email", fromEmail, "name", "CasaGH"),
                "subject", subject,
                "content", List.of(
                        Map.of("type", "text/plain", "value", body)
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(SENDGRID_URL, request, String.class);
        } catch (Exception e) {
            System.err.println("SendGrid email failed to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send email via SendGrid", e);
        }
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String link = baseUrl + "/api/auth/verify-email?token=" + token;
        String body = "Welcome to CasaGH!\n\nPlease verify your email by clicking the link below:\n\n"
                + link + "\n\nThis link will expire once used.\n\nIf you didn't sign up for CasaGH, you can ignore this email.";

        sendEmail(toEmail, "Verify your CasaGH account", body);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = baseUrl + "/api/auth/reset-password?token=" + token;
        String body = "We received a request to reset your CasaGH password.\n\nClick the link below to set a new password:\n\n"
                + link + "\n\nThis link will expire in 30 minutes.\n\nIf you didn't request this, you can safely ignore this email.";

        sendEmail(toEmail, "Reset your CasaGH password", body);
    }
}