FROM eclipse-temurin:17-jdk AS build

WORKDIR /usr/src/server

COPY pom.xml mvnw .mvn/ ./

RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /usr/src/server

COPY --from-build /app/target/sustentify-app.jar ./app.jar

EXPOSE 3000

ENV PORT=${PORT} \
    DB_HOST=${DB_HOST} \
    DB_PORT=${DB_PORT} \
    DB_NAME=${DB_NAME} \
    DB_USERNAME=${DB_USERNAME} \
    DB_PASSWORD=${DB_PASSWORD} \
    JWT_SECRET=${JWT_SECRET} \
    REDIS_HOST=${REDIS_HOST} \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_PASSWORD=${REDIS_PASSWORD} \
    REDIS_TIMEOUT=${REDIS_TIMEOUT}

ENTRYPOINT ["java", "-jar", "app.jar"]