import React from 'react'
import chatImg from '../../image/speak.png';

const JoinCreateChat = () => {
  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-content">
          <div className="chat-image">
            <img src={chatImg} alt="chat icon" />
          </div>

          <h1 className="chat-title">Entrar / Criar Sala </h1>

          <div className="chat-input-group">
            <label htmlFor="email">E-mail *</label>
            <input type="text" id="email" />
          </div>

          <div className="chat-input-group">
            <label htmlFor="password">Your Password</label>
            <input type="text" id="password" />
          </div>

          <div className="chat-buttons">
            <button className="join-btn">Join Room</button>
            <button className="create-btn">Create Room</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat

