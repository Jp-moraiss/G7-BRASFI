package com.g7.brasfi.services;

import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.repositories.PerguntaRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class PerguntaService {

    @Autowired
    private PerguntaRepository perguntaRepository;

    public Pergunta salvar(Pergunta pergunta) {
        return perguntaRepository.save(pergunta);
    }
}
