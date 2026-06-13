package com.casagh.casagh_backend.controller;

import com.casagh.casagh_backend.model.Review;
import com.casagh.casagh_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    // Add a review
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long propertyId = Long.valueOf(request.get("propertyId").toString());
        Integer rating = Integer.valueOf(request.get("rating").toString());
        String comment = request.get("comment").toString();
        return ResponseEntity.ok(reviewService.addReview(userId, propertyId, rating, comment));
    }

    // Get reviews for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Review>> getPropertyReviews(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getPropertyReviews(propertyId));
    }

    // Get reviews by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted!");
    }
}