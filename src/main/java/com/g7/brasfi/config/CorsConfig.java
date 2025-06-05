package com.g7.brasfi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir múltiplas origens (desenvolvimento e produção)
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://localhost:5173"); // Adicionado para Vite
        configuration.addAllowedOrigin("http://localhost:8080");
        configuration.addAllowedOrigin("https://g7-brasfi.onrender.com");
        configuration.addAllowedOrigin("https://brasfi-bice.vercel.app");
        
        // Métodos HTTP permitidos
        configuration.addAllowedMethod("*"); // Mais simples que listar todos
        
        // Headers permitidos
        configuration.addAllowedHeader("*");
        
        // Permitir credenciais
        configuration.setAllowCredentials(true);
        
        // Cache preflight por 1 hora
        configuration.setMaxAge(3600L);
        
        // Headers expostos ao cliente
        configuration.addExposedHeader("Authorization");
        configuration.addExposedHeader("Content-Type");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}