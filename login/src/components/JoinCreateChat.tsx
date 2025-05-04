import React, { useEffect, useState } from 'react'
import chatImg from '../../image/speak.png';
import Profile from './Profile';

const JoinCreateChat = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  if (!isAuthenticated) {
    return (
        <Profile />
    );
}

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-content">
          <div className="chat-image">
            <img src={chatImg} alt="chat icon" />
          </div>

          <h1 className="chat-title">Entrar / Criar Sala </h1>

          <div className="chat-input-group">
            <label htmlFor="password">Id da Sala</label>
            <input type="text" id="password" />
          </div>

          <div className="chat-buttons">
            <button className="join-btn">Join Room</button>
            {isAdmin && (
              <button className="btn btn-edit">
                <a href="/admin">Criar Sala</a>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat

