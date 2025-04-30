package com.g7.brasfi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.domain.user.AuthenticationDTO;
import com.g7.brasfi.domain.user.LoginResponseDTO;
import com.g7.brasfi.domain.user.RegisterDTO;
import com.g7.brasfi.domain.user.User;
import com.g7.brasfi.infra.security.TokenService;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.DatabaseException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TokenService tokenService;
	
	@PostMapping("/login")
	public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
		var auth = this.authenticationManager.authenticate(usernamePassword);
		
		var token = tokenService.generateToken((User) auth.getPrincipal());
		
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
	
	@PostMapping("/register")
	public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
	    if (userRepository.findByLogin(data.login()) != null) {
	        throw new DatabaseException("Login já está em uso.");
	    }

	    if (userRepository.findByCpf(data.cpf()) != null) {
	        throw new DatabaseException("CPF já está em uso.");
	    }

	    String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());

	    User newUser = new User(
	        data.login(),
	        encryptedPassword,
	        data.role(),
	        data.name(),
	        data.phone(),
	        data.cpf(),
	        data.dataNascimento(),
	        data.genero(),
	        data.biografia()
	    );

	    userRepository.save(newUser);

	    return ResponseEntity.ok().build();
	}


}
