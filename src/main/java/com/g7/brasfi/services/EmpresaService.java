package com.g7.brasfi.services;

import com.g7.brasfi.domain.empresa.Empresa;
import com.g7.brasfi.repositories.EmpresaRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class EmpresaService {

    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository) {
        this.repository = repository;
    }

    public Empresa salvar(Empresa empresa) {
        return repository.save(empresa);
    }
    
    public List<Empresa> listarTodas(){
    	return repository.findAll();
    }
    
    public void excluirTodas() {
    	repository.deleteAll();
    }
}
