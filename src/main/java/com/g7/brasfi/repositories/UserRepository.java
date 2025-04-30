package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.g7.brasfi.domain.user.User;

public interface UserRepository extends JpaRepository<User, String>{
	UserDetails findByLogin(String Login);
	
	UserDetails findByCpf(String cpf);
	

}
