package com.g7.brasfi.services;

import com.g7.brasfi.domain.resposta.Resposta;
import com.g7.brasfi.repositories.RespostaRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RespostaService {

    @Autowired
    private RespostaRepository respostaRepository;

    public Resposta salvar(Resposta resposta) {
        return respostaRepository.save(resposta);
    }
    
    public List<Resposta> buscarTodas(){
    	return respostaRepository.findAll();
    }
    
    public void excluirTodas() {
    	respostaRepository.deleteAll();
    }
}
