package com.g7.brasfi.domain.empresa;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TamanhoEmpresa tamanho;
    
    // Construtor vazio obrigatório para JPA
    public Empresa() {
    }

    // Construtor útil para instanciar no código
    public Empresa(String nome, TamanhoEmpresa tamanho) {
        this.nome = nome;
        this.tamanho = tamanho;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TamanhoEmpresa getTamanho() {
        return tamanho;
    }

    public void setTamanho(TamanhoEmpresa tamanho) {
        this.tamanho = tamanho;
    }
}
