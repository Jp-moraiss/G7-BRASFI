package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.empresa.Empresa;
import com.g7.brasfi.services.EmpresaService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }
    
    @GetMapping
    public ResponseEntity<List<Empresa>> listarEmpresas(){
    	List<Empresa> empresas = service.listarTodas();
    	return empresas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(empresas);
    }

    @PostMapping
    public ResponseEntity<Empresa> cadastrarEmpresa(@RequestBody Empresa empresa) {
        Empresa salva = service.salvar(empresa);
        return ResponseEntity.ok(salva);
    }
    
    @DeleteMapping
    public ResponseEntity<Void> excluirTudo(){
    	service.excluirTodas();
    	return ResponseEntity.noContent().build();
    }
}
