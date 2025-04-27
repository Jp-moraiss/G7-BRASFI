package com.g7.brasfi.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.entities.Chat;
import com.g7.brasfi.services.ChatService;

@RestController
@RequestMapping("/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public ResponseEntity<List<Chat>> findAll() {
        return ResponseEntity.ok(chatService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> findById(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Chat> create(@RequestBody Chat chat) {
        return ResponseEntity.ok(chatService.create(chat));
    }

    @PostMapping("/{chatId}/participants/{userId}")
    public ResponseEntity<Void> addParticipant(@PathVariable Long chatId, @PathVariable Long userId) {
        chatService.addParticipant(chatId, userId);
        return ResponseEntity.ok().build();
    }
}
