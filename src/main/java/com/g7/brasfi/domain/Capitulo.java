package com.g7.brasfi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Getter
@Setter
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Capitulo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String titulo;
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    @JsonIgnoreProperties("capitulos") // evita loop infinito na serialização
    private Curso curso;

    @OneToMany(mappedBy = "capitulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Video> videos = new ArrayList<>();

    public Capitulo(String titulo, String descricao, Curso curso) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.curso = curso;
    }

    public void adicionarVideo(Video video) {
        video.setCapitulo(this);
        videos.add(video);
    }

    public void removerVideo(Video video) {
        video.setCapitulo(null);
        videos.remove(video);
    }
}
