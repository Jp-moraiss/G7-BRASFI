package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.resposta.Resposta;
import com.g7.brasfi.services.RespostaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/respostas")
public class RespostaController {

    @Autowired
    private RespostaService respostaService;

    @PostMapping
    public ResponseEntity<Resposta> cadastrarResposta(@RequestBody Resposta resposta) {
        Resposta salva = respostaService.salvar(resposta);
        return ResponseEntity.ok(salva);
    }
    
    @GetMapping
    public ResponseEntity<List<Resposta>> listarTodas(){
    	List<Resposta> respostas = respostaService.buscarTodas();
    	
    	 if (respostas.isEmpty()) {
    	        return ResponseEntity.noContent().build();
    	    } else {
    	        return ResponseEntity.ok(respostas);
    	    }
    }
    
    @DeleteMapping
    public ResponseEntity<Void> excluirTudo(){
    	respostaService.excluirTodas();
    	return ResponseEntity.noContent().build();
    }
}
