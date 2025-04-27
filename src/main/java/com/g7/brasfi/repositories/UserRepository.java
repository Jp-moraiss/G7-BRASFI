package com.g7.brasfi.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{
	
	boolean existsByCpf(String cpf);
	
    Optional<User> findByEmail(String email);

    Optional<User> findByCpf(String cpf);
}
