package com.g7.brasfi.domain.pergunta;

import com.g7.brasfi.domain.empresa.TamanhoEmpresa;
import jakarta.persistence.*;
import java.util.Set;
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

    // Novo campo para armazenar os tamanhos de empresa que podem responder à pergunta
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pergunta_tamanhos", joinColumns = @JoinColumn(name = "pergunta_id"))
    @Column(name = "tamanho_empresa")
    @Enumerated(EnumType.STRING)
    private Set<TamanhoEmpresa> tamanhosPermitidos;

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

    public Set<TamanhoEmpresa> getTamanhosPermitidos() { return tamanhosPermitidos; }
    public void setTamanhosPermitidos(Set<TamanhoEmpresa> tamanhosPermitidos) { this.tamanhosPermitidos = tamanhosPermitidos; }

    public String getPublicoAlvo() { return publicoAlvo; }
    public void setPublicoAlvo(String publicoAlvo) { this.publicoAlvo = publicoAlvo; }
}
