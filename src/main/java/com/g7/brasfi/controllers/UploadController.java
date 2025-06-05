package com.g7.brasfi.controllers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID; // Para gerar nomes de arquivo únicos

@RestController
@RequestMapping("/upload")
public class UploadController {

    private final String UPLOAD_DIR = "uploads/"; // Diretório onde as imagens serão salvas

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Por favor, selecione um arquivo para upload.", HttpStatus.BAD_REQUEST);
        }

        try {
            // Cria o diretório de uploads se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gera um nome de arquivo único para evitar colisões
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Retorna a URL de acesso à imagem
            // **IMPORTANTE**: Em um ambiente de produção, esta URL seria a URL de um CDN ou serviço de armazenamento.
            // Para testar localmente, você precisaria configurar um servidor estático para servir o diretório 'uploads'.
            String fileUrl = "http://localhost:8080/uploads/" + fileName; // Exemplo para acesso local
            return new ResponseEntity<>(fileUrl, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Falha ao fazer upload da imagem: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}