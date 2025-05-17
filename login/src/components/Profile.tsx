import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModulesBox from "./ModulesBox";
import BoxAchievements from "./BoxAchievementsProfile";

const Profile = () => {
    const [userEmail, setUserEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserEmail(parsedUser.email || parsedUser.login || "");
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
            <div className="profile-container not-authenticated">
                <h2>Você não está logado</h2>
                <p>Por favor, faça login para acessar seu perfil.</p>
                <a href="/login" className="login-link">Ir para login</a>
            </div>
        );
    }

    return (
        <div className="main-profile">
            <div className="profile-layout">
                <div className="profile-container">
                    <div className="profile-informations">
                        <div className="profile-avatar">
                        <img src="https://avatar.iran.liara.run/public/28" alt="" />
                        </div>
                        <div className="profile-informacoes">
                        <h1>{userEmail}</h1>
                        <p>Nivel 1</p>
                        </div>
                        <BoxAchievements />
                    </div>
                    <div className="buttons-profile">
                        <div className="button-logout">
                            <button onClick={() => {localStorage.removeItem("user"); window.location.href = "/login";}}><i className="fa-solid fa-right-from-bracket"></i></button>
                        </div>
                    </div>
                </div>

                <div className="achievements-container">
                    <div className="achivements-header">
                        <h1>Conquistas</h1>
                    </div>
                    <div className="achievements-box">
                        <div className="achivimens-informations">
                        <h1>0</h1>
                        <p>Emblemas</p>
                        </div>
                        <div className="achivimens-informations">
                        <h1>0</h1>
                        <p>Badgets</p>
                        </div>
                        <div className="achivimens-informations">
                        <h1>0</h1>
                        <p>Geral</p>
                        </div>
                    </div>
                </div>
            </div>
          
                <div className="modulos-section">
                    <ModulesBox />
                    <ModulesBox />
                    <ModulesBox />
                </div>
     
                
        
</div>

    );
};

export default Profile;