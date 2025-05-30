package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g7.brasfi.domain.Capitulo;
import java.util.List;

@Repository
public interface CapituloRepository extends JpaRepository<Capitulo, String> {
    List<Capitulo> findByCursoId(String id);
}
