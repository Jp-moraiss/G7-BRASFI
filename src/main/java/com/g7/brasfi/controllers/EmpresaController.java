package com.g7.brasfi.controllers;

import com.g7.brasfi.domain.empresa.Empresa;
import com.g7.brasfi.services.EmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Empresa> cadastrarEmpresa(@RequestBody Empresa empresa) {
        Empresa salva = service.salvar(empresa);
        return ResponseEntity.ok(salva);
    }
}
