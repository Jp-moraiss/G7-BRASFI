package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.entities.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long>{

}
