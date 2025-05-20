package course.backend.controllers;

import course.backend.DTOs.ReviewRequest;
import course.backend.DTOs.ReviewResponse;
import course.backend.DTOs.VoteRequest;
import course.backend.entities.CustomUser;
import course.backend.entities.Review;
import course.backend.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{reviewId}/vote")
    public ResponseEntity<ReviewResponse> voteReview(
            @PathVariable Long reviewId,
            @RequestBody VoteRequest voteRequest
    ) {
        CustomUser userDetails = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ReviewResponse response = reviewService.vote(reviewId, voteRequest.value(), userDetails);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestBody ReviewRequest request
    ) {
        CustomUser userDetails = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(request, userDetails));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request
    ) throws AccessDeniedException {
        CustomUser userDetails = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(reviewService.updateReview(id, request, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id
    ) throws AccessDeniedException {
        CustomUser userDetails = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        reviewService.deleteReview(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}

