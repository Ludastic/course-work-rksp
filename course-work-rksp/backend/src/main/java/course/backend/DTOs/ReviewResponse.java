package course.backend.DTOs;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        String title,
        String text,
        int rating,
        int upvotes,
        int downvotes,
        String photoContentType,
        String photoBase64, // Будем отдавать изображение в base64
        LocalDateTime createdAt,
        Integer userVote,
        UserResponse user
) {}