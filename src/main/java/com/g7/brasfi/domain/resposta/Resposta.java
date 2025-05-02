package com.g7.brasfi.domain.resposta;

import com.g7.brasfi.domain.empresa.Empresa;
import com.g7.brasfi.domain.pergunta.Pergunta;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Resposta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "pergunta_id")
    private Pergunta pergunta;

    private String respostaTexto;

    // Getters e Setters
    public UUID getId() { 
    	return id; 
    	}
    public void setId(UUID id) { 
    	this.id = id; 
    	}

    public Empresa getEmpresa() { 
    	return empresa; 
    	}
    public void setEmpresa(Empresa empresa) {
    	this.empresa = empresa; 
    	}

    public Pergunta getPergunta() { 
    	return pergunta; 
    	}
    public void setPergunta(Pergunta pergunta) { 
    	this.pergunta = pergunta; 
    	}

    public String getRespostaTexto() { 
    	return respostaTexto; 
    	}
    public void setRespostaTexto(String respostaTexto) { 
    	this.respostaTexto = respostaTexto; 
    	}
}
