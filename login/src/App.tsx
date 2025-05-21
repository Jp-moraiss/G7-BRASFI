import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import Register from './components/Register';
import EsqueceuSenha from './components/EsqueceuSenha.js';
import Questionario from './components/Questionario';
import JoinCreateChat from './components/JoinCreateChat';
import ChatPage from './components/ChatPage';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import QuestionarioESG from './components/QuestionarioESG.js';

import { CursoPagina } from './components/CursoPagina.js';
import CoursesPage from './components/CoursesPage.js';
import EditProfile from './components/EditProfile.js';
import AdicionarCurso from './components/AdicionarCurso.js';


const App = () => {
  const location = useLocation(); // Pegando a rota atual

  return (
    <div>
      <ChatProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/EsqueceuSenha" element={<EsqueceuSenha />} />
        <Route path="/Questionario" element={<Questionario />} />
        <Route path="/QuestionarioESG" element={<QuestionarioESG />} />
        <Route path="/Chatmain" element={<JoinCreateChat/>} />
        <Route path="/Curso/:id" element={<CursoPagina/>} />
        <Route path="/Cursos" element={<CoursesPage />} />
        <Route path="/AdicionarCurso" element={<AdicionarCurso />} />
        <Route path="/Chat" element={<ChatPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
      </ChatProvider>
  
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