package com.g7.brasfi.services;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.empresa.TamanhoEmpresa;
import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.repositories.PerguntaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PerguntaService {

    @Autowired
    private PerguntaRepository perguntaRepository;

    public Pergunta salvar(Pergunta pergunta) {
        return perguntaRepository.save(pergunta);
    }

    public Optional<Pergunta> buscarPrimeira() {
        return perguntaRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream().findFirst();
    }

    public List<Pergunta> buscarTodas() {
        return perguntaRepository.findAll();
    }
    
    public List<Pergunta> buscarPorTamanho(TamanhoEmpresa tamanho){
    	return perguntaRepository.findByTamanhosPermitidosContaining(tamanho);
    }
    
    public void excluirTodas() {
    	perguntaRepository.deleteAll();
    }
    
    public void excluirByID(UUID id) {
    	if(perguntaRepository.existsById(id)) {
        	perguntaRepository.deleteById(id);
    	}
    	else {
    		throw new EntityNotFoundException("Pergunta não encontrada com o ID: " + id);
    	}
    }

}
