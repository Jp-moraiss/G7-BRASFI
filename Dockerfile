FROM openjdk:17-jdk-slim

WORKDIR /app
COPY . .

# Dá permissão de execução ao mvnw
RUN chmod +x mvnw

# Executa o build do Maven sem rodar os testes
RUN ./mvnw clean package -DskipTests

# Substitua "SEU_ARQUIVO.jar" pelo nome correto do .jar gerado
CMD ["java", "-jar", "target/NOME-DO-ARQUIVO.jar"]
