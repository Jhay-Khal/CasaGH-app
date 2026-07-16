package com.casagh.casagh_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaystackService {

    @Value("${paystack.secret.key}")
    private String secretKey;

    private final RestTemplate restTemplate;

    private static final String INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";
    private static final String VERIFY_URL = "https://api.paystack.co/transaction/verify/";

    public PaystackService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> initializeTransaction(String email, BigDecimal amountInCedis, String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        headers.set("Content-Type", "application/json");

        // Paystack expects the amount in the smallest currency unit (pesewas), so multiply by 100
        long amountInPesewas = amountInCedis.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("amount", amountInPesewas);
        body.put("reference", reference);
        body.put("currency", "GHS");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(INITIALIZE_URL, request, Map.class);
        return response.getBody();
    }

    public Map<String, Object> verifyTransaction(String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                VERIFY_URL + reference,
                HttpMethod.GET,
                request,
                Map.class
        );
        return response.getBody();
    }
}