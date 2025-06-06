package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.domain.landpage.LandPage;

public interface LandPageRepository extends JpaRepository<LandPage, String> {
	
}
