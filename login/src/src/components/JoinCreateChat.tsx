import React, { useEffect, useState } from 'react'
import chatImg from '../../image/speak.png';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';

const JoinCreateChat = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "ADMIN");
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      setError('Por favor, insira um ID de sala válido');
      return;
    }

    try {
      // Check if the room exists
      const response = await fetch(`http://localhost:8080/api/v1/rooms/${roomIdInput}`);
      
      if (response.ok) {
        // Save roomId to localStorage and navigate to chat page
        localStorage.setItem("roomId", roomIdInput);
        navigate('/chat');
      } else {
        setError('Sala não encontrada. Verifique o ID e tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  const handleCreateRoom = async () => {
    if (!roomIdInput.trim()) {
      setError('Por favor, insira um ID de sala válido');
      return;
    }

    try {
      // Create a new room
      const response = await fetch('http://localhost:8080/api/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: roomIdInput
      });

      if (response.ok) {
        // Save roomId to localStorage and navigate to chat page
        localStorage.setItem("roomId", roomIdInput);
        navigate('/chat');
      } else {
        const errorData = await response.text();
        setError(errorData || 'Erro ao criar sala. Tente outro ID.');
      }
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  if (!isAuthenticated) {
    return <Profile />;
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-content">
          <div className="chat-image">
            <img src={chatImg} alt="chat icon" />
          </div>

          <h1 className="chat-title">Entrar / Criar Sala</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="chat-input-group">
            <label htmlFor="roomId">Id da Sala</label>
            <input 
              type="text" 
              id="roomId" 
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </div>

          <div className="chat-buttons">
            <button className="join-btn" onClick={handleJoinRoom}>
              Join Room
            </button>
            {isAdmin && (
              <button className="btn btn-edit" onClick={handleCreateRoom}>
                Criar Sala
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;