import React, { useState, useEffect } from "react";
import Axios from "axios";
import logo from "../../image/logoBRASFI.png";

const API_URL = "https://g7-brasfi.onrender.com";


const EditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [telefone, setTelefone] = useState(""); // This state wasn't being used correctly
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Dados do usuário do localStorage:", parsedUser);

      const userId = parsedUser.id;

      if (!userId) {
        setError("ID do usuário não encontrado. Por favor, faça login novamente.");
        setIsLoading(false);
        return;
      }

      Axios.get(`${API_URL}/users/${userId}`)
        .then(response => {
          console.log("API response data:", response.data);
          const updatedUser = {
            ...parsedUser,
            id: response.data.id,
            cpf: response.data.cpf,
            phone: response.data.phone
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setUser({
            id: response.data.id,
            name: response.data.name || parsedUser.name || "",
            email: response.data.email || parsedUser.email || parsedUser.login || "",
            cpf: response.data.cpf || parsedUser.cpf || "",
            phone: response.data.phone || parsedUser.phone || "",
            role: response.data.role || parsedUser.role
          });

          setName(response.data.name || parsedUser.name || "");
          setEmail(response.data.email || parsedUser.email || parsedUser.login || "");
          setCpf(response.data.cpf || parsedUser.cpf || "");
          setTelefone(response.data.phone || parsedUser.phone || "");
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar usuário atual:", err);

          setUser({
            id: parsedUser.id,
            name: parsedUser.name || "",
            email: parsedUser.email || parsedUser.login || "",
            cpf: parsedUser.cpf || "",
            phone: parsedUser.phone || "",
            role: parsedUser.role
          });

          setName(parsedUser.name || "");
          setEmail(parsedUser.email || parsedUser.login || "");
          setCpf(parsedUser.cpf || "");
          setTelefone(parsedUser.phone || "");
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


  const handleUpdate = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Validate that we have an ID before attempting update
      if (!user?.id) {
        throw new Error("ID do usuário não encontrado. Por favor, faça login novamente.");
      }
      
      console.log(`Enviando atualização para usuário ID: ${user.id}`);
      await Axios.put(`${API_URL}/users/${user.id}`, {
        name: name,
        email: email,
        phone: telefone // Include phone in the update request
      });

      // Atualiza os dados no localStorage mantendo o ID se existir
      const updatedUser = { 
        ...user, 
        name: name, 
        email: email,
        phone: telefone // Make sure to update phone in the local state too
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
            <div className="icons-input">
              <input
                className="input-edit"
                name="name"
                type="text"
                placeholder={name}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setSuccessMessage("");
                }}
              />
              {error.includes("Nome") && (
                <span className="form-error">Nome é obrigatório</span>
              )}
              <i className="fa-solid fa-user"></i>
            </div>
          </div>

          <div className="edit-form-group">
            <p>E-mail *</p>
            <div className="icons-input">
              <input
                className="input-edit"
                name="email"
                type="text"
                placeholder={email}
                value={email}
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
              <i className="fa-solid fa-envelope"></i>
            </div>
          </div>

          <div className="edit-form-group">
            <p>CPF</p>
            <div className="icons-input">
              <input
                className="input-edit"
                name="cpf"
                type="text"
                placeholder={cpf}
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                  setError("");
                  setSuccessMessage("");
                }}
                readOnly
              />
              <i className="fa-solid fa-lock"></i>
            </div>
          </div>

          <div className="edit-form-group">
            <p>Telefone *</p>
            <div className="icons-input">
              <input
                className="input-edit"
                name="telefone"
                type="text"
                placeholder={telefone}
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value); // Fixed: was incorrectly setting email
                  setError("");
                  setSuccessMessage("");
                }}
              />
              {error.includes("Telefone") && (
                <span className="form-error">Telefone é obrigatório</span>
              )}
              <i className="fa-solid fa-phone"></i>
            </div>
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