import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import Profile from './Profile';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config/AxiosHelper';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { getMessagess } from '../services/RoomService';

const ChatPage = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { roomId, connected, setRoomId, setConnected } = useChatContext();

  const navigate = useNavigate();

  const [messages, setMessages] = useState<
    { content: string, sender: string, type?: 'text' | 'image' | 'file', fileName?: string }[]
  >([]);

  function leaveRoom() {
    setConnected(false);
    setRoomId("");
    navigate("/");
  }

  useEffect(() => {
    if (!roomId) {
      const storedRoomId = localStorage.getItem("roomId");
      if (storedRoomId) {
        setRoomId(storedRoomId);
      }
    }
  }, []);

  useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, roomId]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseURL}/chat`),
      reconnectDelay: 5000,
      onConnect: () => {
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers['message']);
        console.error("Additional details: " + frame.body);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: userEmail.split('@')[0],
        content: input,
        type: 'text',
        roomId: roomId
      };

      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(message)
      });

      setMessages(prev => [...prev, message]);
      setInput("");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !stompClient || !connected) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result;
      const isImage = file.type.startsWith("image/");
      const message = {
        sender: userEmail.split("@")[0],
        content: base64Data as string,
        fileName: file.name,
        type: isImage ? "image" : "file",
        roomId: roomId,
      };

      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(message),
      });

      setMessages((prev) => [...prev, message]);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email || parsedUser.login || "";
        setUserEmail(email);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "ADMIN");
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    }
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (!isAuthenticated) {
    return <Profile />;
  }

  return (
    <div className="chatpage-container">
      <header className="chat-header">
        <div>
          <h1 className="chat-header-title">Room: <span>{roomId}</span></h1>
        </div>
        <div>
          <h1 className="chat-header-title">User: <span>{userEmail.split('@')[0] || "..."}</span></h1>
        </div>
        <div>
          <button onClick={leaveRoom} className="leave-button">Leave Room</button>
        </div>
        <div>
          <a href="/"><button className="home-button">Home</button></a>
        </div>
      </header>

      <main ref={chatBoxRef} className="chat-main">
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.sender === userEmail.split('@')[0] ? 'align-right' : 'align-left'}`}>
            <div className={`message-box ${message.sender === userEmail.split('@')[0] ? 'own-message' : 'other-message'}`}>
              <div className="message-content">
                <img className="avatar" src="https://avatar.iran.liara.run/public/28" alt="" />
                <div className="message-text">
                  <p className="sender-name">{message.sender}</p>
                  {message.type === "image" ? (
                    <img src={message.content} alt="imagem" className="chat-image" />
                  ) : message.type === "file" ? (
                    <a href={message.content} download={message.fileName} className="chat-file">
                      📎 {message.fileName}
                    </a>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Digite sua mensagem"
            className="chat-input"
          />
          <div className="chat-actions">
            <button
              className="icon-button purple"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdAttachFile size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button onClick={sendMessage} className="icon-button green">
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
