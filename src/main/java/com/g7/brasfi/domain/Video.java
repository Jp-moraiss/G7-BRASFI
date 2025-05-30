package com.g7.brasfi.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String titulo;
    private String url;

    @ManyToOne
    @JoinColumn(name = "capitulo_id")
    private Capitulo capitulo;

    public Video(String titulo, String url) {
        this.titulo = titulo;
        setUrl(url);
    }

    public void setUrl(String url) {
        if (url != null) {
            if (url.contains("watch?v=")) {
                this.url = url.replace("watch?v=", "embed/");
            } else if (url.contains("youtu.be")) {
                String id = url.substring(url.lastIndexOf("/") + 1);
                if (id.contains("?")) {
                    id = id.substring(0, id.indexOf("?"));
                }
                this.url = "https://www.youtube.com/embed/" + id;
            } else {
                this.url = url;
            }
        }
    }
}
