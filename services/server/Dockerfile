FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/server

COPY pom.xml ./

RUN mvn dependency:go-offline -DskipTests

COPY src ./src

RUN mvn clean package -DskipTests

RUN apt-get install -y curl

RUN curl -L https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar -o opentelemetry-javaagent.jar

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /usr/src/server

COPY --from=build /usr/src/server/target/sustentify-app-0.0.1-SNAPSHOT.jar ./app.jar
COPY --from=build /usr/src/server/target/classes/templates ./templates
COPY --from=build /usr/src/server/opentelemetry-javaagent.jar ./opentelemetry-javaagent.jar

ENV PORT=${PORT}
EXPOSE ${PORT}

ENV JAVA_TOOL_OPTIONS="-javaagent:opentelemetry-javaagent.jar"
ENV OTEL_SERVICE_NAME=sustentify-server
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4318

ENTRYPOINT ["java", "-jar", "app.jar"]