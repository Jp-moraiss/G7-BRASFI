package com.g7.brasfi.domain.resposta;


import java.util.UUID;

import com.g7.brasfi.domain.empresa.Empresa;
import com.g7.brasfi.domain.pergunta.Pergunta;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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
    
    @Enumerated(EnumType.STRING)
    private OpcaoResposta respostaOpcao; // SIM, NAO ou OUTRO
    
    private String respostaTexto; // SÓ USADO SE FOR OUTRO 
    
    // Construtor vazio obrigatório para JPA
    public Resposta() {
    }

    // Construtor útil para instanciar no código
    public Resposta(UUID id, Empresa empresa, Pergunta pergunta, String respostaTexto) {
		super();
		this.id = id;
		this.empresa = empresa;
		this.pergunta = pergunta;
		this.respostaTexto = respostaTexto;
	}

    
    
    // Getters e Setters
    public UUID getId() { 
    	return id; 
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
    public OpcaoResposta getRespostaOpcao() {
        return respostaOpcao;
    }
    public void setRespostaOpcao(OpcaoResposta respostaOpcao) {
        this.respostaOpcao = respostaOpcao;
    }
}
