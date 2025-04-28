package com.g7.brasfi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.dto.LoginDTO;
import com.g7.brasfi.entities.User;
import com.g7.brasfi.services.AuthService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid LoginDTO loginDTO) {
        User authenticatedUser = authService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
        return ResponseEntity.ok(authenticatedUser);
    }
}