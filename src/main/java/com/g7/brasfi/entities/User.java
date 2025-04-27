package com.g7.brasfi.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_user")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String phone;
	private String email;
	private String password;
	private String cpf;
	private LocalDate dataNascimento;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "GMT")
	private Instant dataCriacao;
	private String genero;
	private String biografia;

	@ManyToMany(mappedBy = "participantes")
	private List<Chat> chats = new ArrayList<>();

	@OneToMany(mappedBy = "autor")
	private List<Message> mensagensEnviadas = new ArrayList<>();

	public User() {
	}

	public User(Long id, String name, String phone, String email, String password, String cpf, LocalDate dataNascimento,
				Instant dataCriacao, String genero) {
		super();
		this.id = id;
		this.name = name;
		this.phone = phone;
		this.email = email;
		this.password = password;
		this.cpf = cpf;
		this.dataNascimento = dataNascimento;
		this.dataCriacao = dataCriacao;
		this.genero = genero;
		this.biografia = null;
	}

	// Getters e Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public Instant getDataCriacao() {
		return dataCriacao;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public String getBiografia() {
		return biografia;
	}

	public void setBiografia(String biografia) {
		this.biografia = biografia;
	}

	public List<Chat> getChats() {
		return chats;
	}

	public void setChats(List<Chat> chats) {
		this.chats = chats;
	}

	public List<Message> getMensagensEnviadas() {
		return mensagensEnviadas;
	}

	public void setMensagensEnviadas(List<Message> mensagensEnviadas) {
		this.mensagensEnviadas = mensagensEnviadas;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public int getIdade() {
		return Period.between(dataNascimento, LocalDate.now()).getYears();
	}

	@PrePersist
	public void prePersist() {
		if (this.dataCriacao == null) {
			this.dataCriacao = Instant.now();
		}
	}
}
