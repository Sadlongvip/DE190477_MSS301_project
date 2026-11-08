FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS="-Xms64m -Xmx160m -XX:MaxMetaspaceSize=96m -Xss256k -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -XX:+UseContainerSupport"
EXPOSE 9000
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar app.jar"]
