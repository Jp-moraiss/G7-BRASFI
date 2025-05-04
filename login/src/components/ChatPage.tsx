import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';



const ChatPage = () => {

  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [messages, setMessages] = useState([
    { content: 'Hello ?', sender: `${userEmail.split('@')[0]}` },
    { content: 'Hello ?', sender: 'I´m Fine Bro' },
    { content: 'Hello ?', sender: 'Ankit' },
    { content: 'Hello ?', sender: `${userEmail.split('@')[0]}` }
  ]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email || parsedUser.login || "";
        setUserEmail(email);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "ADMIN");
  
        // Agora que temos o email, inicializamos as mensagens
        const nickname = email.split('@')[0];
        setMessages([
          { content: 'Hello ?', sender: nickname },
          { content: 'Hello ?', sender: 'I´m Fine Bro' },
          { content: 'Hello ?', sender: 'Ankit' },
          { content: 'Hello ?', sender: nickname }
        ]);
  
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);
  

  return (
    <div className="chatpage-container">
      {/* Header */}
      <header className="chat-header">
        <div>
          <h1 className="chat-header-title">Room: <span>Family Room</span></h1>
        </div>
        <div>
            <h1 className="chat-header-title">User: <span>{userEmail.split('@')[0] || "..."}</span></h1>
        </div>
        <div>
          <button className="leave-button">Leave Room</button>
        </div>
      </header>

      {/* Messages */}
      <main className="chat-main">
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.sender === userEmail.split('@')[0] ? 'align-right' : 'align-left'}`}>
            <div className={`message-box ${message.sender === userEmail.split('@')[0] ? 'own-message' : 'other-message'}`}>
              <div className="message-content">
                <img className="avatar" src="https://avatar.iran.liara.run/public/28" alt="" />
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
          <input type="text" placeholder="Digite sua mensagem" className="chat-input" />
          <div className="chat-actions">
            <button className="icon-button purple"><MdAttachFile size={20} /></button>
            <button className="icon-button green"><MdSend size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
