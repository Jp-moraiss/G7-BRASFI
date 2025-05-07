package com.g7.brasfi.chat.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g7.brasfi.chat.entities.Room;

public interface RoomRepository extends JpaRepository<Room, String>{
	
	Room findByRoomId(String roomId);
	
}
	