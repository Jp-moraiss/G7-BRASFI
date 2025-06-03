package com.g7.brasfi.chat.controllers;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.g7.brasfi.chat.entities.Message;
import com.g7.brasfi.chat.entities.Room;
import com.g7.brasfi.chat.playload.MessageRequest;
import com.g7.brasfi.chat.playload.MessageResponse;
import com.g7.brasfi.chat.repositories.MessageRepository;
import com.g7.brasfi.chat.repositories.RoomRepository;
import com.g7.brasfi.domain.user.UserRole;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, MessageRequest request) {
        System.out.println("============================================");
        System.out.println("MENSAGEM RECEBIDA NO BACKEND");
        System.out.println("Sala: " + roomId);
        System.out.println("Remetente: " + request.getSender());
        System.out.println("Função: " + request.getRole());
        System.out.println("Tipo: " + request.getType());
        System.out.println("Conteúdo: " + (request.getContent() != null ? request.getContent().substring(0, Math.min(50, request.getContent().length())) + "..." : "null"));
        System.out.println("============================================");

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            System.out.println("❌ ERRO: Sala não encontrada!");
            throw new ResourceNotFoundException("Room not found!");
        }

        // Salvar no banco
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setRole(UserRole.fromValue(request.getRole()));
        message.setTimeStamp(LocalDateTime.now());
        message.setRoom(room);
        messageRepository.save(message);

        System.out.println("✅ Mensagem salva com ID: " + message.getId());

        // Construir resposta
        MessageResponse response = new MessageResponse();
        response.setContent(message.getContent());
        response.setSender(message.getSender());
        response.setRole(message.getRole().name());
        response.setTimeStamp(message.getTimeStamp());
        response.setType(request.getType());

        messagingTemplate.convertAndSend("/topic/public/" + roomId, response);
        System.out.println("✅ Mensagem enviada para /topic/public/" + roomId);
    }
    
}
