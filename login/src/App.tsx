import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import Register from './components/Register';
import EsqueceuSenha from './components/EsqueceuSenha';
import Questionario from './components/Questionario';


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