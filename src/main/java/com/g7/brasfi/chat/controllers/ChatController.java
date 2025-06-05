package com.g7.brasfi.chat.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.g7.brasfi.chat.playload.MessageRequest;
import com.g7.brasfi.chat.services.ChatService;

@Controller
@CrossOrigin("https://g7-brasfi.onrender.com")
public class ChatController {

	@Autowired
    private ChatService chatService;

    @MessageMapping("/sendMessage/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            MessageRequest request) {

        chatService.processAndSendMessage(roomId, request);
    }
}
