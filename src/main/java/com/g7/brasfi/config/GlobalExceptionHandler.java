package com.g7.brasfi.config;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, 
                                                         HttpServletRequest request) {
        
        logger.error("=== HTTP MESSAGE NOT READABLE ===");
        logger.error("User-Agent: {}", request.getHeader("User-Agent"));
        logger.error("Content-Type: {}", request.getHeader("Content-Type"));
        logger.error("Request URI: {}", request.getRequestURI());
        logger.error("Exception: ", ex);
        
        return ResponseEntity.badRequest()
            .body(Collections.singletonMap("error", "Formato de dados inválido. Verifique o JSON enviado."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex,
                                                       HttpServletRequest request) {
        
        logger.error("=== VALIDATION ERROR ===");
        logger.error("User-Agent: {}", request.getHeader("User-Agent"));
        logger.error("Content-Type: {}", request.getHeader("Content-Type"));
        logger.error("Validation errors: {}", ex.getBindingResult().getAllErrors());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return ResponseEntity.badRequest().body(Collections.singletonMap("errors", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex, HttpServletRequest request) {
        
        logger.error("=== GENERIC ERROR ===");
        logger.error("User-Agent: {}", request.getHeader("User-Agent"));
        logger.error("Content-Type: {}", request.getHeader("Content-Type"));
        logger.error("Request URI: {}", request.getRequestURI());
        logger.error("Exception: ", ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Collections.singletonMap("error", "Erro interno do servidor"));
    }
}