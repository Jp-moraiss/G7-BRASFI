package com.g7.brasfi.chat.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g7.brasfi.chat.entities.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {}