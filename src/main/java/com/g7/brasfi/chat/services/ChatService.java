package com.g7.brasfi.chat.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.g7.brasfi.chat.entities.Message;
import com.g7.brasfi.chat.entities.Room;
import com.g7.brasfi.chat.playload.MessageRequest;
import com.g7.brasfi.chat.playload.MessageResponse;
import com.g7.brasfi.chat.repositories.MessageRepository;
import com.g7.brasfi.chat.repositories.RoomRepository;
import com.g7.brasfi.domain.user.UserRole;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Service
public class ChatService {

	@Autowired
    private RoomRepository roomRepository;
	
	@Autowired
    private MessageRepository messageRepository;
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void processAndSendMessage(String roomId, MessageRequest request) {

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new ResourceNotFoundException("Room not found!");
        }

        // Persistir a mensagem
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setRole(UserRole.fromValue(request.getRole()));
        message.setTimeStamp(LocalDateTime.now());
        message.setRoom(room);
        messageRepository.save(message);

        // Construir resposta
        MessageResponse response = new MessageResponse();
        response.setContent(message.getContent());
        response.setSender(message.getSender());
        response.setRole(message.getRole().name());
        response.setTimeStamp(message.getTimeStamp());
        response.setType(request.getType());

        // Enviar via websocket
        messagingTemplate.convertAndSend("/topic/public/" + roomId, response);
    }
}
