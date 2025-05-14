package com.g7.brasfi.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.domain.Curso;
import com.g7.brasfi.services.CursoService;

@RestController
@RequestMapping("/Curso")
public class CursoController {

	private final CursoService cursoService;

	public CursoController(CursoService cursoService) {
		this.cursoService = cursoService;
	}
	
	@GetMapping
	public ResponseEntity<List<Curso>> visualizarTodos(){
		List<Curso> cursos = cursoService.listarTodos();
		return cursos.isEmpty() ? ResponseEntity.noContent().build(): ResponseEntity.ok(cursos);
	}
	
    @PostMapping
    public ResponseEntity<Curso> cadastrarEmpresa(@RequestBody Curso curso) {
        Curso salvar = cursoService.salvar(curso);
        return ResponseEntity.ok(salvar);
    }
	
}
