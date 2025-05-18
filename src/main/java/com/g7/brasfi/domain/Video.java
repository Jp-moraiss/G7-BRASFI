package com.g7.brasfi.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Video {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String titulo;
	private String url;
	
	// adicionar manytoOne capitulos depois
	
	public Video() {
		
	}

	public Video(long id, String titulo, String url) {
		super();
		this.id = id;
		this.titulo = titulo;
		this.url = url;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
	    if (url != null) {
	        if (url.contains("watch?v=")) {
	            this.url = url.replace("watch?v=", "embed/");
	        } else if (url.contains("youtu.be")) {
	            // extrair o ID do vídeo
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


	public long getId() {
		return id;
	}
	
	
	
}
