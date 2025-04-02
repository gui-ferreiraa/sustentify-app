FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/server

COPY pom.xml ./

RUN mvn dependency:go-offline -DskipTests

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /usr/src/server

COPY --from=build /usr/src/server/target/sustentify-app-0.0.1-SNAPSHOT.jar ./app.jar

ENV PORT=${PORT}

EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]