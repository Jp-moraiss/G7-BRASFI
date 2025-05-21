package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.domain.Curso;

public interface CursoRepository extends JpaRepository<Curso, String>{
}
