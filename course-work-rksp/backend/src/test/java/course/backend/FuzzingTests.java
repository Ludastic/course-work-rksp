package course.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import java.util.Base64;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FuzzingTests {

    @Autowired
    private TestRestTemplate restTemplate;

    private final Random random = new Random();
    private final String[] MALICIOUS_PATTERNS = {
            "<script>alert(1)</script>",
            "' OR 1=1 --",
            "{\"invalid\": \"json\"}"
    };

    // Генератор случайных строк
    private String generateRandomString(int length) {
        byte[] array = new byte[length];
        random.nextBytes(array);
        return new String(array);
    }

    // Генератор случайного Base64
    private String generateRandomBase64() {
        byte[] bytes = new byte[random.nextInt(1000)];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    @Test
    void fuzzCreateReviewEndpoint() {
//        for (int i = 0; i < 50; i++) { // 50 итераций для примера
//            // Создаем случайное тело запроса
//            String body = String.format(
//                    "{\"title\": \"%s\", \"text\": \"%s\", \"rating\": %d, " +
//                            "\"photoBase64\": \"%s\", \"photoContentType\": \"image/png\"}",
//                    MALICIOUS_PATTERNS[random.nextInt(MALICIOUS_PATTERNS.length)],
//                    generateRandomString(1000),
//                    random.nextInt(-100, 100),
//                    generateRandomBase64()
//            );
//
//            // Отправляем запрос
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            HttpEntity<String> request = new HttpEntity<>(body, headers);
//
//            ResponseEntity<String> response = restTemplate.postForEntity(
//                    "/api/reviews",
//                    request,
//                    String.class
//            );
//
//            // Проверяем ответ
//            assertTrue(
//                    response.getStatusCode().is4xxClientError() ||
//                            response.getStatusCode().is2xxSuccessful(),
//                    "Unexpected status code: " + response.getStatusCode()
//            );
//
//            assertFalse(
//                    response.getBody().toLowerCase().contains("exception"),
//                    "Response contains exception details"
//            );
//        }

    }
}
