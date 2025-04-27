package com.g7.brasfi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.entities.Message;

public interface MessageRepository extends JpaRepository<Message, Long>{

}
