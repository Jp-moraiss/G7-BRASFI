package com.g7.brasfi.chat.controllers;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.g7.brasfi.chat.entities.Message;
import com.g7.brasfi.chat.entities.Room;
import com.g7.brasfi.chat.playload.MessageRequest;
import com.g7.brasfi.chat.repositories.MessageRepository;
import com.g7.brasfi.chat.repositories.RoomRepository;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

	@Autowired
	private RoomRepository roomRepository;
	//for sending and receiving messages
	
	@Autowired
	private MessageRepository messageRepository;

	@MessageMapping("/sendMessage/{roomId}")
	@SendTo("/topic/room/{roomId}")
	public Message sendMessage(@DestinationVariable String roomId, MessageRequest request) {
		Room room = roomRepository.findByRoomId(roomId);

		if (room == null) {
			throw new ResourceNotFoundException("Room not found!");
		}

		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimeStamp(LocalDateTime.now());
		message.setRoom(room); // se Message tem uma relação @ManyToOne Room

		messageRepository.save(message);

		return message;
	}


}
