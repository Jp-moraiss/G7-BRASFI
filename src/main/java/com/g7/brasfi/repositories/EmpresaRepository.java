package com.g7.brasfi.repositories;

import com.g7.brasfi.domain.empresa.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
