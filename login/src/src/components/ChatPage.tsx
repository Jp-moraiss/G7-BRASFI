import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatPage = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email || parsedUser.login || "";
        setUserEmail(email);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "ADMIN");
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }

    // Load roomId from localStorage
    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
      fetchMessages(storedRoomId);
      connectToWebsocket(storedRoomId);
    } else {
      console.log("roomId está vazio!");
      navigate('/join'); // Redirect to join page if no roomId is found
    }

    return () => {
      // Cleanup WebSocket connection when component unmounts
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [navigate]);

  const connectToWebsocket = (roomId) => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    
    client.connect({}, () => {
      console.log("Connected to WebSocket");
      setStompClient(client);
      
      // Subscribe to the room's message topic
      client.subscribe(`/topic/public/${roomId}`, onMessageReceived);
    }, error => {
      console.error("WebSocket connection error:", error);
    });
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } else {
        console.error("Failed to fetch messages:", response.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages(prevMessages => [...prevMessages, message]);
    scrollToBottom();
  };

  const sendMessage = () => {
    if (stompClient && input.trim() !== "" && roomId) {
      const chatMessage = {
        sender: userEmail.split('@')[0],
        content: input.trim(),
        timeStamp: new Date()
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const leaveRoom = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    localStorage.removeItem("roomId");
    navigate('/chatmain');
  };

  if (!isAuthenticated) {
    return <Profile />;
  }

  return (
    <div className="chatpage-container">
      {/* Header */}
      <header className="chat-header">
        <div>
          <h1 className="chat-header-title">Room: <span>{roomId || "..."}</span></h1>
        </div>
        <div>
          <h1 className="chat-header-title">User: <span>{userEmail.split('@')[0] || "..."}</span></h1>
        </div>
        <div>
          <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
        </div>
      </header>

      {/* Messages */}
      <main className="chat-main" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.sender === userEmail.split('@')[0] ? 'align-right' : 'align-left'}`}>
            <div className={`message-box ${message.sender === userEmail.split('@')[0] ? 'own-message' : 'other-message'}`}>
              <div className="message-content">
                <img className="avatar" src={`https://avatar.iran.liara.run/public/${(index + message.sender.length) % 30}`} alt="" />
                <div className="message-text">
                  <p className="sender-name">{message.sender}</p>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input 
            type="text" 
            placeholder="Digite sua mensagem" 
            className="chat-input" 
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef}
          />
          <div className="chat-actions">
            <button className="icon-button purple"><MdAttachFile size={20} /></button>
            <button className="icon-button green" onClick={sendMessage}><MdSend size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;