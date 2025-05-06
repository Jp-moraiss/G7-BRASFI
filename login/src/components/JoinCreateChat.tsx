import React, { useEffect, useState } from 'react'
import chatImg from '../../image/speak.png';
import Profile from './Profile';
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../services/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: ""
  });

  const {roomId, connected, setRoomId, setConnected} = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event: { target: { name: any; value: any; }; }){
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm(){
    if(detail.roomId === ""){
      toast.error('Insira um Id')
      return false;
    }
    return true;
  }

  async function joinChat(){
    if(validateForm()){
      // join chat
    }

    try {
      const room = await joinChatApi(detail.roomId)
      toast.success("Entrando")
      setRoomId(room.roomId);
      setConnected(true);
      navigate('/Chat')

    } catch (error) {
      if(error.status == 400){
        toast.error(error.response.data);
      } else {
        toast.error("Erro ao entrar na sala");
      }
     
      console.log(error)
    }
  }

  async function createRoom(roomId: string) {
    if (!validateForm()) return;
  
    try {
      const response = await createRoomApi(detail.roomId);
      toast.success("Sala Criada");
  
      setRoomId(response.roomId);
      localStorage.setItem("roomId", response.roomId);
      setConnected(true);
      navigate("/Chat");
  
    } catch (error) {
      console.log(error);
      if (error.status == 400) {
        toast.error("Sala já existe");
      } else {
        toast.error("Erro ao Criar Sala");
      }
    }
  }
  

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
            <label htmlFor="room">Id da Sala</label>
            <input  
              name="roomId" // <- ESSENCIAL
              value={detail.roomId} 
              onChange={handleFormInputChange} 
              type="text" 
              id="roomId"
              placeholder="Enter the room Id" 
            />

            
          </div>

          <div className="chat-buttons">
            <button onClick={joinChat} className="join-btn">Join Room</button>
            {isAdmin && (
              <button onClick={() => createRoom(detail.roomId)} className="btn btn-edit">
                Criar Sala
              </button>
            
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat

