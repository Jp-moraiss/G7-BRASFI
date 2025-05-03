package com.g7.brasfi.chat;

import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "messages")
@EqualsAndHashCode(of = "id")
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	private String sender;
	private String content;
	private LocalDateTime time;
}
