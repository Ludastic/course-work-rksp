package course.backend.DTOs;

public record ReviewRequest(
        String title,
        String text,
        int rating,
        String photoBase64,  // Добавлено поле для Base64
        String photoContentType
) {}
