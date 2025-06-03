import React, { useEffect, useState } from 'react';
import brasfiLogo from '../../image/logoBRASFI.png';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // novo estado

  const toggleSubmenu = (menuName: string | null) => {
    setOpenSubmenu(prev => (prev === menuName ? null : menuName));
  };

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

  return (
    <div>
      <header className="site-header">
        <div className="container">
          <div className='logo'>
            <a href="/"><img src={brasfiLogo} alt="Logo da Brasfi" /></a>
          </div>
          <nav className="menu">
            <ul>
              <li><a href="/">Início</a></li>
              {isAuthenticated && (
                <>
                  <li><a href="/Profile">Perfil</a></li>
                  <li><a href="/cursos">Cursos</a></li>
                  <li><a href="/chat">Chat</a></li>


              

                  <div className="avatar-header">
                    <img className="avatar" src="https://avatar.iran.liara.run/public/28" alt="" />
                  </div>
                </>
              )}
              
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
