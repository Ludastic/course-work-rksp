FROM gradle:8.7-jdk21-alpine AS builder

WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

RUN chmod +x gradlew

RUN --mount=type=cache,target=/home/gradle/.gradle/caches \
    ./gradlew dependencies --no-daemon

COPY src ./src

RUN --mount=type=cache,target=/home/gradle/.gradle/caches \
    ./gradlew clean build --no-daemon -x test \
    -Porg.gradle.java.installations.auto-detect=false

FROM eclipse-temurin:21-jre-alpine

ENV TZ=Europe/Moscow \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75 --enable-preview"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/build/libs/*.jar ./app.jar

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]

