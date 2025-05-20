package com.g7.brasfi.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

import com.g7.brasfi.domain.Capitulo;
import com.g7.brasfi.services.CapituloService;


@RestController
@RequestMapping("/capitulos")
public class CapituloController {

    @Autowired
    private CapituloService capituloService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Capitulo> criar(@RequestBody Capitulo capitulo) {
        return ResponseEntity.ok(capituloService.salvar(capitulo));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Capitulo>> listarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(capituloService.listarPorCurso(cursoId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Capitulo> atualizar(@PathVariable Long id, @RequestBody Capitulo capitulo) {
        return ResponseEntity.ok(capituloService.atualizar(id, capitulo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        capituloService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

