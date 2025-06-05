# Usa uma imagem leve do OpenJDK
FROM openjdk:17-jdk-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia o JAR para dentro do container
COPY target/*.jar app.jar

# Comando para rodar a aplicação
ENTRYPOINT ["java","-jar","app.jar"]
