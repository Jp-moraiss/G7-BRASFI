package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.services.PerguntaService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.services.PerguntaService;

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


}
