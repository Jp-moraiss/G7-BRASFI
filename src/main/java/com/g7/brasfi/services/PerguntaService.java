package com.g7.brasfi.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.repositories.PerguntaRepository;


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
    
}
