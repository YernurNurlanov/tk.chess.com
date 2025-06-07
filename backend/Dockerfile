FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/main ./src/main
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/chess-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]