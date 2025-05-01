package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.pergunta.Pergunta;
import com.g7.brasfi.services.PerguntaService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

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
}
