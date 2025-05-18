import React, { useState, useEffect } from "react";
import Axios from "axios";
import logo from "../../image/logoBRASFI.png";

const API_URL = "http://localhost:8080";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    // Tenta obter dados do usuário do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Dados do usuário do localStorage:", parsedUser);
        
        // Tenta obter o ID do usuário autenticado
        Axios.get(`${API_URL}/users/me`, {
          headers: {
            // Adicione headers de autenticação se necessário
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => {
            if (response.data && response.data.id) {
              const updatedUser = {
                ...parsedUser,
                id: response.data.id
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              
              setUser({
                id: response.data.id,
                name: response.data.name || parsedUser.name || "",
                email: response.data.email || parsedUser.email || parsedUser.login || "",
                role: response.data.role || parsedUser.role
              });
              
              setName(response.data.name || parsedUser.name || "");
              setEmail(response.data.email || parsedUser.email || parsedUser.login || "");
              setIsLoading(false);
            } else {
              throw new Error("ID do usuário não encontrado na resposta da API");
            }
          })
          .catch(err => {
            console.error("Erro ao buscar usuário atual:", err);
            
            const userEmail = parsedUser.email || parsedUser.login;
            
            setUser({
              id: parsedUser.id, 
              name: parsedUser.name || "",
              email: userEmail || "",
              role: parsedUser.role,
            });
            
            setName(parsedUser.name || "");
            setEmail(userEmail || "");
            
            if (!parsedUser.id) {
              setError("Não foi possível obter o ID do usuário. Por favor, faça login novamente.");
            }
            
            setIsLoading(false);
          });
      } catch (e) {
        console.error("Erro ao processar dados do usuário:", e);
        setError("Erro ao carregar dados do usuário.");
        setIsLoading(false);
      }
    } else {
      setError("Usuário não encontrado no localStorage. Por favor, faça login novamente.");
      setIsLoading(false);
    }
  }, []);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    setIsLoading(true);
    
    try {
      // Se temos um ID de usuário, usamos ele para atualizar
      if (user?.id) {
        console.log(`Enviando atualização para usuário ID: ${user.id}`);
        await Axios.put(`${API_URL}/users/${user.id}`, {
          name: name,
          email: email
        });
      } 
      // Se não temos ID, tentamos atualizar usando o endpoint do usuário atual
      else {

        await Axios.put(`${API_URL}/users/${user?.id}`, {
          name: name,
          email: email
        });
      }

      // Atualiza os dados no localStorage mantendo o ID se existir
      const updatedUser = { 
        ...user, 
        name: name, 
        email: email 
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setError("");
      setSuccessMessage("Dados atualizados com sucesso!");

      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erro na atualização:", err);
      setError("Erro ao atualizar os dados. Por favor, tente novamente ou faça login novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Carregando dados do usuário...</p>;

  return (
    <div className="password-container">
      <div className="password-box">
        <div className="cabecalho-edit">
          <div className="cabecalho-edit-img">
            <img src={logo} alt="Logo" />
          </div>
          <div className="cabecalho-edit-text">
            <h1>Atualizar seus Dados</h1>
            <p>Preencha seus dados para atualizar</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="edit-form" onSubmit={handleUpdate}>
          <div className="edit-form-group">
            <p>Nome *</p>
            <input
              className="input-edit"
              name="name"
              type="text"
              placeholder={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
            />
            {error.includes("Nome") && (
              <span className="form-error">Nome é obrigatório</span>
            )}
          </div>

          <div className="edit-form-group">
            <p>E-mail *</p>
            <input
              className="input-edit"
              name="email"
              type="text"
              placeholder={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
            />
            {error.includes("Email") && (
              <span className="form-error">
                {error.includes("inválido") ? "Email inválido" : "Email é obrigatório"}
              </span>
            )}
          </div>

          <button className="register-button" type="submit" disabled={isLoading}>
            {isLoading ? "CARREGANDO..." : "SALVAR"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;