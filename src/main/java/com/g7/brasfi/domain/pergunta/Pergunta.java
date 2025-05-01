package com.g7.brasfi.domain.pergunta;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Pergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String texto;

    @Enumerated(EnumType.STRING)
    private CategoriaESG categoria;

    private int peso;           // 1 a 5
    private String publicoAlvo; // ex: "MICRO", "GRANDE", etc.

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public CategoriaESG getCategoria() { return categoria; }
    public void setCategoria(CategoriaESG categoria) { this.categoria = categoria; }

    public int getPeso() { return peso; }
    public void setPeso(int peso) { this.peso = peso; }

    public String getPublicoAlvo() { return publicoAlvo; }
    public void setPublicoAlvo(String publicoAlvo) { this.publicoAlvo = publicoAlvo; }
}
