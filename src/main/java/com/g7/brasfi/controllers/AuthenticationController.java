package com.g7.brasfi.controllers;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.domain.user.AuthenticationDTO;
import com.g7.brasfi.domain.user.LoginResponseDTO;
import com.g7.brasfi.domain.user.RegisterDTO;
import com.g7.brasfi.services.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
@CrossOrigin(
    origins = {
        "http://localhost:3000", 
        "http://localhost:8080", 
        "http://localhost:5173",
        "https://g7-brasfi.onrender.com",
        "https://brasfi-bice.vercel.app"
    },
    allowCredentials = "true",
    maxAge = 3600,
    allowedHeaders = "*"
)
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthenticationDTO data, 
                                  BindingResult bindingResult,
                                  HttpServletRequest request) {
        
        // Log para debug
        logger.info("=== LOGIN REQUEST DEBUG ===");
        logger.info("User-Agent: {}", request.getHeader("User-Agent"));
        logger.info("Content-Type: {}", request.getHeader("Content-Type"));
        logger.info("Accept: {}", request.getHeader("Accept"));
        logger.info("Origin: {}", request.getHeader("Origin"));
        logger.info("Data received: {}", data.toString());
        
        // Verificar se há erros de validação
        if (bindingResult.hasErrors()) {
            logger.error("Validation errors: {}", bindingResult.getAllErrors());
            return ResponseEntity.badRequest()
                .body(Collections.singletonMap("error", "Dados inválidos: " + bindingResult.getAllErrors()));
        }
        
        try {
            LoginResponseDTO response = authService.login(data);
            logger.info("Login successful for user");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO data, 
                                    BindingResult bindingResult,
                                    HttpServletRequest request) {
        
        // Log para debug
        logger.info("=== REGISTER REQUEST DEBUG ===");
        logger.info("User-Agent: {}", request.getHeader("User-Agent"));
        logger.info("Content-Type: {}", request.getHeader("Content-Type"));
        logger.info("Accept: {}", request.getHeader("Accept"));
        logger.info("Origin: {}", request.getHeader("Origin"));
        logger.info("Data received: {}", data.toString());
        
        // Verificar se há erros de validação
        if (bindingResult.hasErrors()) {
            logger.error("Validation errors: {}", bindingResult.getAllErrors());
            return ResponseEntity.badRequest()
                .body(Collections.singletonMap("error", "Dados inválidos: " + bindingResult.getAllErrors()));
        }
        
        try {
            authService.register(data);
            logger.info("Registration successful");
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Registration error: ", e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}