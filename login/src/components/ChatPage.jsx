import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdSend, MdClose } from 'react-icons/md';
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
  const [isAdmin, setIsAdmin] = useState();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [openSubmenu, setOpenSubmenu] = useState();
  const [availableRooms, setAvailableRooms] = useState([]);
  
  // Estados para o modal de criar sala
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');
  const [createRoomError, setCreateRoomError] = useState('');
  
  // Estados para filtrar arquivos
  const [showFiles, setShowFiles] = useState(false);
  const [fileType, setFileType] = useState(''); // 'docs' ou 'photos'

  const toggleSubmenu = (menuName) => {
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
        setIsAdmin(parsedUser.role === "admin" || parsedUser.role === "ADMIN");
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    // Buscar salas disponíveis
    fetchAvailableRooms();

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

  const fetchAvailableRooms = () => {
    fetch("https://g7-brasfi.onrender.com/api/v1/rooms")
      .then(res => res.json())
      .then(data => setAvailableRooms(data))
      .catch(err => console.error("Erro ao buscar salas:", err));
  };

  // Função para entrar em uma sala
  const handleJoinRoom = (selectedRoomId) => {
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

  // Função para abrir o modal de criar sala
  const handleOpenCreateRoomModal = () => {
    if (!isAdmin) {
      alert('Apenas administradores podem criar salas');
      return;
    }
    setShowCreateRoomModal(true);
    setNewRoomId('');
    setCreateRoomError('');
  };

  // Função para fechar o modal
  const handleCloseCreateRoomModal = () => {
    setShowCreateRoomModal(false);
    setNewRoomId('');
    setCreateRoomError('');
  };

  // Função para criar uma nova sala
  const handleCreateRoom = async () => {
    if (!newRoomId.trim()) {
      setCreateRoomError('Por favor, insira um ID de sala válido');
      return;
    }

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/api/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: newRoomId
      });

      if (response.ok) {
        // Atualizar lista de salas
        fetchAvailableRooms();
        
        // Entrar na nova sala
        handleJoinRoom(newRoomId);
        
        // Fechar modal
        handleCloseCreateRoomModal();
      } else {
        const errorData = await response.text();
        setCreateRoomError(errorData || 'Erro ao criar sala. Tente outro ID.');
      }
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      setCreateRoomError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  const connectToWebsocket = (roomId) => {
    const socket = new SockJS('https://g7-brasfi.onrender.com/ws');
    const client = Stomp.over(socket);
    client.debug = (msg) => console.log('[STOMP]', msg);

    client.connect({}, () => {
      stompClientRef.current = client;
      client.subscribe(`/topic/public/${roomId}`, onMessageReceived);
    }, error => {
      console.error("Erro ao conectar no WebSocket:", error);
    });
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`https://g7-brasfi.onrender.com/api/v1/rooms/${roomId}/messages`);
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

  // Função para filtrar e obter arquivos
  const getFilteredFiles = (type) => {
    return messages.filter(message => {
      if (type === 'photos') {
        return message.type === 'image';
      } else if (type === 'docs') {
        return message.type === 'document' || (message.type === 'file' && message.fileName);
      }
      return false;
    });
  };

  // Função para abrir modal de arquivos
  const handleShowFiles = (type) => {
    setFileType(type);
    setShowFiles(true);
  };

  // Função para fechar modal de arquivos
  const handleCloseFiles = () => {
    setShowFiles(false);
    setFileType('');
  };

  // Função para renderizar preview de arquivo
  const renderFilePreview = (message) => {
    if (message.type === 'image') {
      return (
        <img 
          src={message.content} 
          alt={message.fileName} 
          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
        />
      );
    } else {
      return (
        <div className="file-preview-doc">
          <i className="fa-solid fa-file"></i>
          <div className="file-info">
            <span className="file-name">{message.fileName}</span>
            {message.fileSize && (
              <span className="file-size">
                ({(message.fileSize / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
        </div>
      );
    }
  };

  // Controle do input file escondido
  const fileInputRef = useRef(null);

  const handleAttachButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const stompClient = stompClientRef.current;
    if (!stompClient || !roomId) return;

    const isImage = file.type.startsWith("image/");
    const isDocument = file.type.includes("pdf") || 
                     file.type.includes("document") || 
                     file.type.includes("text") ||
                     file.type.includes("sheet") ||
                     file.type.includes("presentation") ||
                     file.name.match(/\.(doc|docx|pdf|txt|xls|xlsx|ppt|pptx)$/i);

    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result;
      const message = {
        sender: userEmail.split("@")[0],
        role: isAdmin ? "admin" : "USER",
        content: isImage || isDocument ? base64Data : `Arquivo: ${file.name}`,
        fileName: file.name,
        fileSize: file.size,
        type: isImage ? "image" : isDocument ? "document" : "file",
        roomId: roomId,
        timeStamp: new Date(),
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      
      // Não adicionar diretamente às mensagens, deixar o WebSocket fazer isso
      event.target.value = ''; // Limpar o input
    };

    // Ler como base64 apenas para imagens e documentos pequenos (< 5MB)
    if ((isImage || isDocument) && file.size < 5 * 1024 * 1024) {
      reader.readAsDataURL(file);
    } else {
      // Para arquivos grandes ou outros tipos, enviar apenas informações
      const message = {
        sender: userEmail.split("@")[0],
        role: isAdmin ? "admin" : "USER",
        content: `📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        fileName: file.name,
        fileSize: file.size,
        type: "file",
        roomId: roomId,
        timeStamp: new Date(),
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      event.target.value = '';
    }
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

          <div className="roombox-add" onClick={handleOpenCreateRoomModal}>
            <i className="fa-solid fa-plus"></i>
          </div>

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
                    {message.type === 'image' ? (
                      <div className="image-message">
                        <img 
                          src={message.content} 
                          alt={message.fileName} 
                          style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px' }}
                        />
                        {message.fileName && <p className="file-name">{message.fileName}</p>}
                      </div>
                    ) : message.type === 'document' || message.type === 'file' ? (
                      <div className="file-message">
                        <i className="fa-solid fa-file"></i>
                        <div className="file-info">
                          <span className="file-name">{message.fileName}</span>
                          {message.fileSize && (
                            <span className="file-size">
                              ({(message.fileSize / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

        <div className="files-wrapper">
          <div className="docs" onClick={() => handleShowFiles('docs')}>
            <i className="fa-solid fa-file-text"></i>
            <span>Documentos ({getFilteredFiles('docs').length})</span>
          </div>
          <div className="photos" onClick={() => handleShowFiles('photos')}>
            <i className="fa-solid fa-image"></i>
            <span>Fotos ({getFilteredFiles('photos').length})</span>
          </div>
        </div>
      </div>

      {/* Modal para visualizar arquivos */}
      {showFiles && (
        <div className="modal-overlay">
          <div className="modal-content files-modal">
            <div className="modal-header">
              <h2>{fileType === 'photos' ? 'Fotos da Sala' : 'Documentos da Sala'}</h2>
              <button className="modal-close-btn" onClick={handleCloseFiles}>
                <MdClose />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="files-grid">
                {getFilteredFiles(fileType).length === 0 ? (
                  <div className="no-files">
                    <i className={`fa-solid ${fileType === 'photos' ? 'fa-image' : 'fa-file'}`}></i>
                    <p>Nenhum {fileType === 'photos' ? 'foto' : 'documento'} encontrado</p>
                  </div>
                ) : (
                  getFilteredFiles(fileType).map((message, index) => (
                    <div key={index} className="file-item">
                      <div className="file-preview">
                        {renderFilePreview(message)}
                      </div>
                      <div className="file-details">
                        <span className="file-sender">{message.sender}</span>
                        <span className="file-date">
                          {new Date(message.timeStamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para criar sala */}
      {showCreateRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Criar Nova Sala</h2>
              <button className="modal-close-btn" onClick={handleCloseCreateRoomModal}>
                <MdClose />
              </button>
            </div>
            
            <div className="modal-body">
              {createRoomError && (
                <div className="error-message">{createRoomError}</div>
              )}
              
              <div className="input-group">
                <label htmlFor="newRoomId">ID da Nova Sala</label>
                <input
                  type="text"
                  id="newRoomId"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                  placeholder="Digite o ID da sala"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={handleCloseCreateRoomModal}>
                Cancelar
              </button>
              <button className="btn btn-create" onClick={handleCreateRoom}>
                Criar Sala
              </button>
            </div>
          </div>
        </div>
      )}

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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="attach-btn" onClick={handleAttachButtonClick}>
            <MdAttachFile />
          </button>
          <button className="send-btn" onClick={sendMessage}>
            <MdSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;