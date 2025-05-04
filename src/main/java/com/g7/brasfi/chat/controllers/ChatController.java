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
import com.g7.brasfi.chat.repositories.RoomRepository;
import com.g7.brasfi.services.exceptions.ResourceNotFoundException;

@Controller
@CrossOrigin("http:localhost:3000")
public class ChatController {

	@Autowired
	private RoomRepository roomRepository;
	//for sending and receiving messages
	
	@MessageMapping("/sendMessage/{roomId}")
	@SendTo("/topic/room/{roomId}")
	public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest request) {
		
		Room room = roomRepository.findByRoomId(request.getRoomId());
		
		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimeStamp(LocalDateTime.now());
		
		if (room != null) {
			room.getMessages().add(message);
			roomRepository.save(room);
		} else {
			throw new ResourceNotFoundException("Room not found!");
		}
		
		return message;
		
	}
	
}
