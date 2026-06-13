package com.casagh.casagh_backend.service;

import com.casagh.casagh_backend.model.Property;
import com.casagh.casagh_backend.model.Review;
import com.casagh.casagh_backend.model.User;
import com.casagh.casagh_backend.repository.PropertyRepository;
import com.casagh.casagh_backend.repository.ReviewRepository;
import com.casagh.casagh_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public Review addReview(Long userId, Long propertyId, Integer rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found!"));

        Review review = new Review();
        review.setUser(user);
        review.setProperty(property);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public List<Review> getPropertyReviews(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId);
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}