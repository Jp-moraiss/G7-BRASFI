import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Home from './components/Home.jsx';
import Register from './components/Register.jsx';
import EsqueceuSenha from './components/EsqueceuSenha.jsx';
import Questionario from './components/Questionario.jsx';
import JoinCreateChat from './components/JoinCreateChat.jsx';
import ChatPage from './components/ChatPage.jsx';
import Header from './components/Header.jsx';
import QuestionarioESG from './components/QuestionarioESG.jsx';
import { CursoPagina } from './components/CursoPagina.jsx';
import CoursesPage from './components/CoursesPage.jsx';
import EditProfile from './components/EditProfile.jsx';
import AdicionarCurso from './components/AdicionarCurso.jsx';
import EditarCurso from './components/AdicionarCapitulos.jsx';
import AdicionarCapitulos from './components/AdicionarCapitulos.jsx';
import AdicionarVideos from './components/AdicionarVideos.jsx';
import AdicionarPerguntas from './components/AdicionarPerguntas.jsx';

const App = () => {
  return (
    <div>
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
        <Route path="/Cursos/:id" element={<CursoPagina />} />
        <Route path="/Cursos" element={<CoursesPage />} />
        <Route path="/AdicionarCurso" element={<AdicionarCurso />} />
        <Route path="/AdicionarCapitulos" element={<AdicionarCapitulos />} />
        <Route path="/AdicionarVideos" element={<AdicionarVideos />} />
        <Route path="/AdicionarPerguntas" element={<AdicionarPerguntas />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
