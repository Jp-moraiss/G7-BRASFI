package com.g7.brasfi.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.domain.Curso;
import com.g7.brasfi.domain.user.User;
import com.g7.brasfi.repositories.CursoRepository;
import com.g7.brasfi.services.CursoService;

@RestController
@RequestMapping("/Curso")
public class CursoController {

	private final CursoService cursoService;

	@Autowired
	private CursoRepository cursoRepository;

	public CursoController(CursoService cursoService) {
		this.cursoService = cursoService;
	}

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        Optional<Curso> optionalCurso = cursoRepository.findById(id);

        if (optionalCurso.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(optionalCurso.get());
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
