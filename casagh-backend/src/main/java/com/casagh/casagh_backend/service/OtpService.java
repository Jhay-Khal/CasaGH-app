package com.casagh.casagh_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    @Value("${arkesel.api.key}")
    private String apiKey;

    @Value("${arkesel.sender.id}")
    private String senderId;

    private final String BASE_URL = "https://sms.arkesel.com/api/otp";
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendOtp(String phoneNumber) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("expiry", 5);
        body.put("length", 6);
        body.put("medium", "sms");
        body.put("message", "Your CasaGH verification code is %otp_code%. It expires in 5 minutes.");
        body.put("number", phoneNumber);
        body.put("sender_id", senderId);
        body.put("type", "numeric");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(BASE_URL + "/generate", request, Map.class);
            String code = (String) response.getBody().get("code");
            return "1000".equals(code);
        } catch (Exception e) {
            System.out.println("Arkesel send OTP failed: " + e.getMessage());
            return false;
        }
    }

    public boolean verifyOtp(String phoneNumber, String otpCode) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("code", otpCode);
        body.put("number", phoneNumber);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(BASE_URL + "/verify", request, Map.class);
            String code = (String) response.getBody().get("code");
            return "1100".equals(code);
        } catch (Exception e) {
            System.out.println("Arkesel verify OTP failed: " + e.getMessage());
            return false;
        }
    }
}