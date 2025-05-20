package course.backend.services;

import course.backend.DTOs.ReviewRequest;
import course.backend.DTOs.ReviewResponse;
import course.backend.DTOs.UserResponse;
import course.backend.DTOs.VoteRequest;
import course.backend.entities.CustomUser;
import course.backend.entities.Review;
import course.backend.entities.Vote;
import course.backend.repositories.ReviewRepository;
import course.backend.repositories.UserRepository;
import course.backend.repositories.VoteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    private static final int MAX_FILE_SIZE = 5 * 1024 * 1024;

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ReviewResponse createReview(ReviewRequest request, CustomUser user) {
        Review review = new Review();
        review.setTitle(request.title());
        review.setText(request.text());
        review.setRating(request.rating());
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);

        if (request.photoBase64() != null && !request.photoBase64().isEmpty()) {
            review.setPhotoData(request.photoBase64());
            review.setPhotoContentType(request.photoContentType());
        }

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
    }

    public ReviewResponse updateReview(Long id, ReviewRequest request, CustomUser user) throws AccessDeniedException {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && user.getRole().equals("ROLE_USER") ) {
            throw new AccessDeniedException("You can only edit your own reviews");
        }

        review.setTitle(request.title());
        review.setText(request.text());
        review.setRating(request.rating());

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    public void deleteReview(Long id, CustomUser user) throws AccessDeniedException {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new AccessDeniedException("You don't have permission to delete this review");
        }

        voteRepository.deleteAllByReview(review);
        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        Integer userVote = voteRepository.findByUserAndReview(userRepository.getById(review.getUser().getId()), review)
                .map(Vote::getValue)
                .orElse(null);
        return new ReviewResponse(
                review.getId(),
                review.getTitle(),
                review.getText(),
                review.getRating(),
                review.getUpvotes(),
                review.getDownvotes(),
                review.getPhotoContentType(),
                review.getPhotoData(), // Теперь просто возвращаем сохраненную строку
                review.getCreatedAt(),
                userVote,
                new UserResponse(
                        review.getUser().getId(),
                        review.getUser().getUsername(),
                        review.getUser().getRole()
                )
        );
    }

    @Transactional
    public ReviewResponse vote(Long reviewId, int value, CustomUser voter) {
        if (value != 1 && value != -1) {
            throw new IllegalArgumentException("Недопустимое значение голоса");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Отзыв не найден"));

        if (review.getUser().getId().equals(voter.getId())) {
            throw new IllegalStateException("Нельзя голосовать за свой отзыв");
        }

        Vote existingVote = voteRepository.findByUserAndReview(voter, review)
                .orElse(null);

        if (existingVote != null) {
            // Отменяем предыдущий голос
            if (existingVote.getValue() == 1) {
                review.setUpvotes(review.getUpvotes() - 1);
            } else {
                review.setDownvotes(review.getDownvotes() - 1);
            }
            voteRepository.delete(existingVote);
        }

        // Добавляем новый голос
        if (value == 1) {
            review.setUpvotes(review.getUpvotes() + 1);
        } else {
            review.setDownvotes(review.getDownvotes() + 1);
        }

        Vote newVote = new Vote();
        newVote.setUser(voter);
        newVote.setReview(review);
        newVote.setValue(value);
        voteRepository.save(newVote);

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }
}
