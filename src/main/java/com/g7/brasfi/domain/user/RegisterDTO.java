package com.g7.brasfi.domain.user;

import java.time.LocalDate;

public record RegisterDTO(
    String login,
    String password,
    UserRole role,
    String name,
    String phone,
    String cpf,
    LocalDate dataNascimento,
    String genero,
    String biografia
) {
}
