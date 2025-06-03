package com.g7.brasfi.controllers;


import com.g7.brasfi.domain.empresa.TamanhoEmpresa;
import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.services.PerguntaService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/perguntas")
public class PerguntaController {

    @Autowired
    private PerguntaService perguntaService;

    @PostMapping
    public ResponseEntity<Pergunta> cadastrarPergunta(@RequestBody Pergunta pergunta) {
        Pergunta salva = perguntaService.salvar(pergunta);
        return ResponseEntity.ok(salva);
    }


    @GetMapping("/primeira")
    public ResponseEntity<Pergunta> buscarPrimeiraPergunta() {
    return perguntaService.buscarPrimeira()
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<List<Pergunta>> listarPerguntas() {
        List<Pergunta> perguntas = perguntaService.buscarTodas();
        return perguntas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(perguntas);
    }
    
    @GetMapping("/por-tamanho/{tamanho}")
    	public ResponseEntity<List<Pergunta>> buscarPorTamanho(@PathVariable TamanhoEmpresa tamanho){
    		List<Pergunta> perguntasTamanho = perguntaService.buscarPorTamanho(tamanho);
    		return ResponseEntity.ok(perguntasTamanho);
    }
    
    @DeleteMapping
    public ResponseEntity<Void> excluirTudo(){
    	perguntaService.excluirTodas();
    	return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/por-id/{id}")
    public ResponseEntity<Void> excluirPorID(@PathVariable UUID id) {
        try {
            perguntaService.excluirByID(id);
            return ResponseEntity.noContent().build(); // 204 - Sucesso sem corpo
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();  // 404 - Não encontrado
        }
    }

}
