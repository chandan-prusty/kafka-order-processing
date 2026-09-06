# Build Stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B || true
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/kafka-order-processing-*.jar app.jar

ENV PORT=8085
EXPOSE 8085

# Constrain JVM memory so it runs smoothly inside Render's 512MB RAM free limit
ENTRYPOINT ["java", "-Xmx350m", "-Xms64m", "-jar", "app.jar"]
