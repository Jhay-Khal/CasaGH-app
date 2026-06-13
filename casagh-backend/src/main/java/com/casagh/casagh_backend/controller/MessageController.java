package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.Message;
import com.casagh.casagh_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    // Send a message
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> request) {
        Long senderId = Long.valueOf(request.get("senderId").toString());
        Long receiverId = Long.valueOf(request.get("receiverId").toString());
        Long propertyId = Long.valueOf(request.get("propertyId").toString());
        String content = request.get("content").toString();
        return ResponseEntity.ok(messageService.sendMessage(senderId, receiverId, propertyId, content));
    }

    // Get sent messages
    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<Message>> getSent(@PathVariable Long senderId) {
        return ResponseEntity.ok(messageService.getSentMessages(senderId));
    }

    // Get received messages
    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Message>> getReceived(@PathVariable Long receiverId) {
        return ResponseEntity.ok(messageService.getReceivedMessages(receiverId));
    }

    // Get messages for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Message>> getPropertyMessages(@PathVariable Long propertyId) {
        return ResponseEntity.ok(messageService.getPropertyMessages(propertyId));
    }
}