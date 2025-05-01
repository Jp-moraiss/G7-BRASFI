package com.g7.brasfi.repositories;

import com.g7.brasfi.domain.pergunta.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PerguntaRepository extends JpaRepository<Pergunta, UUID> {
}
