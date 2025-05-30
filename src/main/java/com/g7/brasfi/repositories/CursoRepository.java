package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g7.brasfi.domain.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, String>{

}
