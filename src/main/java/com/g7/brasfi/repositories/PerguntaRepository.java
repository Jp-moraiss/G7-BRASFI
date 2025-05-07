package com.g7.brasfi.repositories;

import com.g7.brasfi.domain.pergunta.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import com.g7.brasfi.domain.empresa.TamanhoEmpresa;
import java.util.Set;


public interface PerguntaRepository extends JpaRepository<Pergunta, UUID> {
	List<Pergunta> findByTamanhosPermitidosContaining(TamanhoEmpresa tamanho);
}
