FROM eclipse-temurin:21-jdk

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/NOME-DO-ARQUIVO.jar"]
