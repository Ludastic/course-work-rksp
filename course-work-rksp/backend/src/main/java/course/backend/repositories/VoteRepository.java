package course.backend.repositories;

import course.backend.entities.CustomUser;
import course.backend.entities.Review;
import course.backend.entities.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndReview(CustomUser user, Review review);
    void deleteAllByReview(Review review);
}