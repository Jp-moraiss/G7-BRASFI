package com.g7.brasfi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.user.AuthenticationDTO;
import com.g7.brasfi.domain.user.LoginResponseDTO;
import com.g7.brasfi.domain.user.RegisterDTO;
import com.g7.brasfi.domain.user.User;
import com.g7.brasfi.domain.user.UserRole;
import com.g7.brasfi.infra.security.TokenService;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.DatabaseException;

@Service
public class AuthService {

	@Autowired
    private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TokenService tokenService;

    @Value("${admin.secret}")
    private String adminSecret;

    public LoginResponseDTO login(AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);

        var user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user);

        return new LoginResponseDTO(token, user.getId(), user.getLogin(), user.getName());
    }

    public void register(RegisterDTO data) {
        if (userRepository.findByLogin(data.login()) != null) {
            throw new DatabaseException("Login já está em uso.");
        }

        if (userRepository.findByCpf(data.cpf()) != null) {
            throw new DatabaseException("CPF já está em uso.");
        }

        if (data.role() == UserRole.ADMIN) {
            if (data.adminSecret() == null || !data.adminSecret().equals(adminSecret)) {
                throw new RuntimeException("Senha de admin inválida.");
            }
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
    }
}
