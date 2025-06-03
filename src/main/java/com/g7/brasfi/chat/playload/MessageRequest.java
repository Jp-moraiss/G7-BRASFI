package com.g7.brasfi.chat.playload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

	private String content;
	private String sender;
	private String role;
	private String type;
	private String roomId;
}
