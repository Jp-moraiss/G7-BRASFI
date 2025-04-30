package com.g7.brasfi.domain.user;

import java.time.LocalDate;

import com.g7.brasfi.validation.AdultValidator;
import com.g7.brasfi.validation.CPFValidator;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
    @NotBlank(message = "Login é obrigatório")
    @Email(message = "Login deve ser um email válido")
    String login,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    String password,

    @NotNull(message = "Role é obrigatória")
    UserRole role,

    @NotBlank(message = "Nome é obrigatório")
    String name,

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve conter entre 10 e 11 dígitos numéricos")
    String phone,

    @NotBlank(message = "CPF é obrigatório")
    @CPFValidator
    String cpf,

    @NotNull(message = "Data de nascimento é obrigatória")
    @AdultValidator
    LocalDate dataNascimento,

    String genero, // opcional

    String biografia // opcional
) {}

