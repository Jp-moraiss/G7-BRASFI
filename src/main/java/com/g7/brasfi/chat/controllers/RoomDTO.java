package com.g7.brasfi.chat.controllers;

public class RoomDTO {
	private String roomId;

	public RoomDTO(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomId() {
		return roomId;
	}
}