package course.backend.repositories;

import course.backend.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE Review r SET r.upvotes = r.upvotes + 1 WHERE r.id = :reviewId")
    void incrementUpvotes(@Param("reviewId") Long reviewId);

    @Modifying
    @Query("UPDATE Review r SET r.downvotes = r.downvotes + 1 WHERE r.id = :reviewId")
    void incrementDownvotes(@Param("reviewId") Long reviewId);
}