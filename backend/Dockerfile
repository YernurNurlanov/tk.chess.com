# Используем официальный образ Maven для сборки приложения
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Устанавливаем рабочую директорию для приложения
WORKDIR /app

# Копируем pom.xml и скачиваем зависимости
COPY pom.xml .

# Скачиваем зависимости
RUN mvn dependency:go-offline

# Копируем исходный код
COPY src ./src

# Собираем приложение
RUN mvn clean package -DskipTests

# Используем OpenJDK образ для запуска приложения
FROM eclipse-temurin:21-jre

# Устанавливаем рабочую директорию для приложения
WORKDIR /app

# Копируем собранный JAR файл из предыдущего этапа
COPY --from=build /app/target/chess-0.0.1-SNAPSHOT.jar app.jar

# Команда для запуска приложения
CMD ["java", "-jar", "app.jar"]

# Открываем порт для приложения
EXPOSE 8080