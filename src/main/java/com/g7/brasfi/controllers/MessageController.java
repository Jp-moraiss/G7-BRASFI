package com.g7.brasfi.controllers;

import com.g7.brasfi.entities.Message;
import com.g7.brasfi.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/{chatId}/users/{userId}")
    public ResponseEntity<Message> sendMessage(@PathVariable Long chatId, @PathVariable Long userId, @RequestBody String texto) {
        Message message = messageService.sendMessage(chatId, userId, texto);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> findByChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(messageService.findByChat(chatId));
    }
}
