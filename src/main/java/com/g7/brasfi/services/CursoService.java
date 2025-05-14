package com.g7.brasfi.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.Curso;
import com.g7.brasfi.repositories.CursoRepository;

@Service
public class CursoService {
	
	private final CursoRepository cursoRepository;

	public CursoService(CursoRepository cursoRepository) {
		this.cursoRepository = cursoRepository;
	}
	
	public Curso salvar(Curso curso) {
		return cursoRepository.save(curso);
	}
	
	public List<Curso> listarTodos(){
		return cursoRepository.findAll();
	}
	
	
	
}
