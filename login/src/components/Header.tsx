import React, { useEffect, useState } from 'react'
import brasfiLogo  from '../../image/logoBRASFI.png'


const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                    <img src={brasfiLogo} alt="Logo da Brasfi" />
                </div>
                <nav className="menu">
                <ul>
                    <li><a href="#inicio">Início</a></li>
                    {isAuthenticated && (
                    <>
                        <li><a href="/Profile">Perfil</a></li>
                        <li><a href="/Chat">Chat</a></li>
                    </>
                    )}
                </ul>
                </nav>
            </div>
        </header>

    </div>
  )
}

export default Header
