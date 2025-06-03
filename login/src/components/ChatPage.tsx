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
  const stompClientRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  const toggleSubmenu = (menuName: string | null) => {
    setOpenSubmenu(prev => (prev === menuName ? null : menuName));
  };

  useEffect(() => {
    // Carregar usuário
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email || parsedUser.login || "";
        setUserEmail(email);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "admin");
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    // Buscar salas disponíveis
    fetch("http://localhost:8080/api/v1/rooms")
      .then(res => res.json())
      .then(data => setAvailableRooms(data))
      .catch(err => console.error("Erro ao buscar salas:", err));

    // Conectar à sala armazenada (se existir)
    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
      fetchMessages(storedRoomId);
      connectToWebsocket(storedRoomId);
    } else {
      navigate('/chatmain');
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [navigate]);

  // Função para entrar em uma sala
  const handleJoinRoom = (selectedRoomId: string) => {
    if (selectedRoomId === roomId) return; // se já estiver na mesma sala, não faz nada

    // desconecta do stomp antigo
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }

    setRoomId(selectedRoomId);
    localStorage.setItem("roomId", selectedRoomId);
    setMessages([]); // limpa mensagens da sala anterior
    fetchMessages(selectedRoomId);
    connectToWebsocket(selectedRoomId);
  };

  const connectToWebsocket = (roomId: string) => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = (msg) => console.log('[STOMP]', msg);

    client.connect({}, () => {
      stompClientRef.current = client;
      client.subscribe(`/topic/public/${roomId}`, onMessageReceived);
    }, error => {
      console.error("Erro ao conectar no WebSocket:", error);
    });
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } else {
        console.error("Erro ao buscar mensagens:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    setMessages(prevMessages => {
      const last = prevMessages[prevMessages.length - 1];
      const same = last &&
        last.sender === message.sender &&
        last.content === message.content &&
        new Date(last.timeStamp).getTime() === new Date(message.timeStamp).getTime();

      return same ? prevMessages : [...prevMessages, message];
    });

    scrollToBottom();
  };

  const sendMessage = () => {
    const stompClient = stompClientRef.current;
    if (stompClient && input.trim() !== "" && roomId) {
      const chatMessage = {
        sender: userEmail.split('@')[0],
        content: input.trim(),
        timeStamp: new Date(),
        role: isAdmin ? "admin" : "USER"
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setInput("");
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
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
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
    localStorage.removeItem("roomId");
    navigate('/chatmain');
  };

  // Controle do input file escondido
  const fileInputRef = useRef(null);

  const handleAttachButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const stompClient = stompClientRef.current;
    if (!stompClient || !roomId) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result;
      const isImage = file.type.startsWith("image/");
      const message = {
        sender: userEmail.split("@")[0],
        role: isAdmin ? "admin" : "USER",
        content: base64Data as string,
        fileName: file.name,
        type: isImage ? "image" : "file",
        roomId: roomId,
        timeStamp: new Date(),
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
    };

    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return <Profile />;
  }

  return (
    <div className="chatpage-container">
      <div className="chat-wrapper">
        <div className="roomslist">
          {availableRooms.map((room) => (
            <div
              key={room.roomId}
              className="roombox"
              onClick={() => handleJoinRoom(room.roomId)}>
              <h1>{room.roomId}</h1>
            </div>
          ))}
          <div className="roombox-logout" onClick={leaveRoom}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>

        <div className="optionslist">
          <div className="box-textos-chat">
            <h1>Sala: {roomId}</h1>
            <ul>
              <li className={`menu-item ${openSubmenu === 'admins' ? 'open' : ''}`}>
                <h1
                  onClick={(e) => { e.preventDefault(); toggleSubmenu('admins'); }}
                  className="menu-title"
                >
                  Administradores <span className="arrow">{openSubmenu === 'admins' ? '^' : '˅'}</span>
                </h1>
                {openSubmenu === 'admins' && (
                  <ul className="submenu">
                    {[...new Set(messages.filter(msg => msg.role === "admin").map(msg => msg.sender))].map((admin, idx) => (
                      <li key={idx}>
                        <p>{admin}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>   
          </div>
        </div>

        <main className="chat-main" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender === userEmail.split('@')[0] ? 'align-right' : 'align-left'}`}
            >
              <div className={`message-box ${message.sender === userEmail.split('@')[0] ? 'own-message' : 'other-message'}`}>
                <div className="message-content">
                  <img
                    className="avatar"
                    src={`https://avatar.iran.liara.run/public/${(index + message.sender.length) % 30}`}
                    alt=""
                  />
                  <div className="message-text">
                    <p className="sender-name">
                      {message.sender} - {message.role === "admin" ? "Admin" : "Estudante"}
                    </p>
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            placeholder="Digite sua mensagem"
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <div className="chat-actions">
            {/* Input file escondido */}
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button className='action-chat-button' onClick={handleAttachButtonClick}>
              <MdAttachFile />
            </button>
            <button className='action-chat-button' onClick={sendMessage}>
              <MdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
