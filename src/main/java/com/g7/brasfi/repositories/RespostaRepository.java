package com.g7.brasfi.repositories;

import com.g7.brasfi.domain.resposta.Resposta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RespostaRepository extends JpaRepository<Resposta, UUID> {
}
