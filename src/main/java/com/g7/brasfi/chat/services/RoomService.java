package com.g7.brasfi.chat.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.g7.brasfi.chat.entities.Message;
import com.g7.brasfi.chat.entities.Room;
import com.g7.brasfi.chat.repositories.RoomRepository;

@Service
public class RoomService {

	@Autowired
    private RoomRepository roomRepository;

    @Transactional
    public Room createRoom(String roomId) {
        if (roomRepository.findByRoomId(roomId) != null) {
            throw new IllegalArgumentException("Room already exists!");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        return roomRepository.save(room);
    }

    public Room getRoom(String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new IllegalArgumentException("Room not found!");
        }
        return room;
    }

    public List<Message> getMessages(String roomId, int page, int size) {
        Room room = getRoom(roomId);

        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);

        return messages.subList(start, end);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}
