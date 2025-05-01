import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
    // Estados para armazenar as informações do usuário
    const [userEmail, setUserEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // useEffect para carregar os dados do usuário do localStorage quando o componente montar
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserEmail(parsedUser.email || "");
                setIsAuthenticated(parsedUser.authenticated || false);
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
            <div className="profile-container not-authenticated">
                <h2>Você não está logado</h2>
                <p>Por favor, faça login para acessar seu perfil.</p>
                <a href="/login" className="login-link">
                    Ir para login
                </a>
            </div>
        );
    }
    
    // Renderizar o perfil do usuário
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h2>Perfil do Usuário</h2>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <p><strong>Status:</strong> {isAuthenticated ? "Autenticado" : "Não autenticado"}</p>
                </div>
            </div>
            
            <div className="profile-details">
                <h3>Detalhes da Conta</h3>
                <p>Bem-vindo ao seu perfil, {userEmail.split('@')[0]}!</p>
                <p>Aqui você pode gerenciar suas informações e preferências.</p>
                
                <div className="profile-actions">
                    <button
                        className="btn btn-logout"
                        onClick={() => {
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}
                    >
                        Sair da Conta
                    </button>
                    <button className="btn btn-edit">
                        <a href="/EditarPerfil">Editar Perfil</a>
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default Profile;