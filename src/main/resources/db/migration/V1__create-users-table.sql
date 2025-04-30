CREATE TABLE users (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name TEXT NOT NULL,
	phone TEXT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	cpf TEXT UNIQUE,
	data_nascimento DATE,
	data_criacao TIMESTAMP,
	genero TEXT,
	biografia TEXT
);
