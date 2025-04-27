package com.g7.brasfi.entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String texto;
    
    private LocalDateTime horaEnvio;

    @ManyToOne
    private User autor;

    @ManyToOne
    @JsonIgnore
    private Chat chat;

    public Message() {
    }

	public Message(String texto, User autor, Chat chat) {
		this.texto = texto;
		this.horaEnvio = LocalDateTime.now();
		this.autor = autor;
		this.chat = chat;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public LocalDateTime getHoraEnvio() {
		return horaEnvio;
	}

	public void setHoraEnvio(LocalDateTime horaEnvio) {
		this.horaEnvio = horaEnvio;
	}

	public User getAutor() {
		return autor;
	}

	public void setAutor(User autor) {
		this.autor = autor;
	}

	public Chat getChat() {
		return chat;
	}

	public void setChat(Chat chat) {
		this.chat = chat;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
    @JsonProperty("autor")
    public String getAutorNome() {
        return this.autor != null ? this.autor.getName() : null;
    }

	@Override
	public int hashCode() {
		return Objects.hash(horaEnvio, id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Message other = (Message) obj;
		return Objects.equals(horaEnvio, other.horaEnvio) && Objects.equals(id, other.id);
	}

}
