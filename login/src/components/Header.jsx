import React, { useEffect, useState } from 'react';
import brasfiLogo from '../../image/logoBRASFI.png';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        console.log("Dados do usuário carregados:", parsedUser);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado no localStorage");
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <a href="/"><img src={brasfiLogo} alt="Logo da Brasfi" /></a>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <i class="fa-solid fa-bars" style={{color: 'black'}}></i>
        </div>

        <nav className={`menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/">Início</a></li>
            {!isAuthenticated && (
              <li><a href="/login">Registrar</a></li>
            )}
            {isAuthenticated && (
              <>
                <li><a href="/Profile">Perfil</a></li>
                <li><a href="/cursos">Cursos</a></li>
                <li><a href="/chat">Chat</a></li>
                <li><a href="/QuestionarioESG">Questionario</a></li>
                <div className="avatar-header">
                  <img className="avatar" src="https://avatar.iran.liara.run/public/28" alt="avatar" />
                </div>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
