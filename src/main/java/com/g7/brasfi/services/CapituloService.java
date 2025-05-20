package com.g7.brasfi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g7.brasfi.domain.Capitulo;
import com.g7.brasfi.repositories.CapituloRepository;

import java.util.List;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Service
public class CapituloService {

    @Autowired
    private CapituloRepository capituloRepository;

    public Capitulo salvar(Capitulo capitulo) {
        return capituloRepository.save(capitulo);
    }

    public List<Capitulo> listarPorCurso(Long cursoId) {
        return capituloRepository.findByCursoId(cursoId);
    }

    public Capitulo atualizar(Long id, Capitulo atualizado) {
        Capitulo existente = capituloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Capítulo não encontrado"));
        existente.setTitulo(atualizado.getTitulo());
        existente.setDescricao(atualizado.getDescricao());
        return capituloRepository.save(existente);
    }

    public void deletar(Long id) {
        capituloRepository.deleteById(id);
    }
}
