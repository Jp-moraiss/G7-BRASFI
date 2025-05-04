package com.g7.brasfi.chat.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.g7.brasfi.chat.entities.Room;
import com.g7.brasfi.chat.entities.Message;
import com.g7.brasfi.chat.repositories.RoomRepository;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http:localhost:3000")
public class RoomController {

	@Autowired
	private RoomRepository roomRepository;
	
	//create chat
	@PostMapping
	public ResponseEntity<?> createRoom(@RequestBody String roomId) {
	    roomId = roomId.trim(); // Trim whitespace and newlines
	    
	    if (roomRepository.findByRoomId(roomId) != null) {
	        return ResponseEntity.badRequest().body("Room already exists!");
	    }
	    
	    Room room = new Room();
	    room.setRoomId(roomId);
	    Room savedRoom = roomRepository.save(room);
	    
	    // Ensure response is clean
	    savedRoom.setRoomId(savedRoom.getRoomId().trim());
	    
	    return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
	}
	
	//get chat: join
	@GetMapping("/{roomId}")
	public ResponseEntity<?> joinRoom(@PathVariable String roomId){
		Room room = roomRepository.findByRoomId(roomId);
		
		if (room == null) return ResponseEntity.badRequest().body("Room not found!");
		
		return ResponseEntity.ok(room); 
	}
	
	
	//get messages of the room
	@GetMapping("/{roomId}/messages")
	public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId, 
			@RequestParam(value = "page", defaultValue = "0", required = false) int page,
			@RequestParam(value = "size", defaultValue = "20", required = false) int size){
		
		Room room = roomRepository.findByRoomId(roomId);
		
		if (room == null) return ResponseEntity.badRequest().build();
		
		List<Message> messages = room.getMessages();

		int start = Math.max(0 , messages.size() - (page + 1) * size);
		int end = Math.min(messages.size(), start + size);
		List<Message> paginatedMessages = messages.subList(start, end);
		
		return ResponseEntity.ok(paginatedMessages);
	}
}
