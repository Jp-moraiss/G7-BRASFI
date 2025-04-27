package com.g7.brasfi.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g7.brasfi.entities.Chat;
import com.g7.brasfi.entities.User;
import com.g7.brasfi.repositories.ChatRepository;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Service
public class ChatService {

	@Autowired
	private ChatRepository chatRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	public List<Chat> findAll(){
		return chatRepository.findAll();
	}
	
	public Chat findById(Long id) {
		Optional<Chat> chat = chatRepository.findById(id);
		return chat.orElseThrow(() -> new ResourceNotFoundException(id));
	}
	
	public Chat create(Chat chat) {
		return chatRepository.save(chat);
	}
	
	public void addParticipant(Long chatId, Long userId) {
		Chat chat = findById(chatId);
		User user = userRepository.findById(userId).
						orElseThrow(() -> new ResourceNotFoundException(userId));
		chat.getParticipantes().add(user);
		chatRepository.save(chat);
	}
}
