import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [connected, setConnected] = useState(false);

  // Recuperar roomId do localStorage ao iniciar
  useEffect(() => {
    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
    }
  }, []);

  return (
    <ChatContext.Provider value={{ roomId, connected, setRoomId, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
