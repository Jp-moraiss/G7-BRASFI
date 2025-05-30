package com.g7.brasfi.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.Curso;
import com.g7.brasfi.repositories.CursoRepository;

@Service
public class CursoService {
	
	private CursoRepository cursoRepository;

	public CursoService(CursoRepository cursoRepository) {
		this.cursoRepository = cursoRepository;
	}
	
	public Curso salvar(Curso curso) {
		return cursoRepository.save(curso);
	}

	public void deletar(String id) {
		if (!cursoRepository.existsById(id)) {
			throw new RuntimeException("Curso não encontrado com o ID: " + id);
		}
		cursoRepository.deleteById(id);
	}


	

	public Optional<Curso> findById(String id) {
		return cursoRepository.findById(id);
	}

	
	public List<Curso> listarTodos(){
		return cursoRepository.findAll();
	}
	
	
	
}
