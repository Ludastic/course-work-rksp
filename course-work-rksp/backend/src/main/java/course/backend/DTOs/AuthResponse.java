package course.backend.DTOs;

public record AuthResponse(
        Long id,
        String username,
        String role,
        String token
) {}