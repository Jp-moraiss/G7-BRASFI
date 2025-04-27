package com.g7.brasfi.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g7.brasfi.entities.Chat;
import com.g7.brasfi.entities.Message;
import com.g7.brasfi.entities.User;
import com.g7.brasfi.repositories.ChatRepository;
import com.g7.brasfi.repositories.MessageRepository;
import com.g7.brasfi.repositories.UserRepository;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Message sendMessage(Long chatId, Long userId, String texto) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException(chatId));
        User autor = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(userId));

        Message message = new Message();
        message.setTexto(texto);
        message.setHoraEnvio(LocalDateTime.now());
        message.setAutor(autor);
        message.setChat(chat);

        return messageRepository.save(message);
    }

    public List<Message> findByChat(Long chatId) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException(chatId));
        return chat.getMessages();
    }
}
