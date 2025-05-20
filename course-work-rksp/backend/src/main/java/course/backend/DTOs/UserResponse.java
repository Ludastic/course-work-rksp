package course.backend.DTOs;

public record UserResponse(
        Long id,
        String username,
        String role
) {}
