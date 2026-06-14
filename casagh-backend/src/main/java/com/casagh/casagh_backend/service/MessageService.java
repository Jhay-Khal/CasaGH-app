package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.model.Message;
import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.MessageRepository;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public Message sendMessage(Long senderId, Long receiverId, Long propertyId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found!"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found!"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProperty(property);
        message.setContent(content);
        Message saved = messageRepository.save(message);

        // Notify the receiver
        notificationService.createNotification(
                receiver,
                "NEW_MESSAGE",
                sender.getFullName() + " sent you a message about \"" + property.getTitle() + "\"",
                property.getId(),
                saved.getId()
        );

        return saved;
    }

    public List<Message> getSentMessages(Long senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    public List<Message> getReceivedMessages(Long receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }

    public List<Message> getPropertyMessages(Long propertyId) {
        return messageRepository.findByPropertyId(propertyId);
    }
}