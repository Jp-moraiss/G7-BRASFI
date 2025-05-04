import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import Register from './components/Register';
import EsqueceuSenha from './components/EsqueceuSenha';
import Questionario from './components/Questionario';
import JoinCreateChat from './components/JoinCreateChat';
import ChatPage from './components/ChatPage';


const App = () => {
  const location = useLocation(); // Pegando a rota atual

  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
        <Route path="/Questionario" element={<Questionario />} />
        <Route path="/chatmain" element={<JoinCreateChat/>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<h1>This is bout page</h1>} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
  
    </div>
  );
};

// Envolve tudo corretamente no BrowserRouter
const Main = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Main;