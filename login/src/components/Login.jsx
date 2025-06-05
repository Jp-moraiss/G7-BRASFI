import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";

import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../image/logoBRASFI.png";

// URL da API - Configurar baseado no ambiente
const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://g7-brasfi.onrender.com" 
  : "http://localhost:8080"; // ou a porta do seu backend local

// Configurar Axios globalmente
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Inicializar com null
  const [loading, setLoading] = useState(false); // Inicializar com false

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const Login = () => {
  const [localUser, setLocalUser] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  // Contexto de autenticação
  const authContext = useContext(AuthContext);

  const user = authContext?.user || localUser;
  const setUser = authContext?.setUser || setLocalUser;
  const loading = authContext?.loading || localLoading;
  const setLoading = authContext?.setLoading || setLocalLoading;

  // Validação com Yup
  const validationLogin = yup.object().shape({
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Campo obrigatório"),
  });

  // Lógica de login
  const handleClickLogin = async (values) => {
    setLoading(true);
    setError("");

    try {
      console.log("Tentando fazer login...", { email: values.email });
      
      const response = await Axios.post(`${API_URL}/auth/login`, {
        login: values.email,
        password: values.password,
        // Removido role se não for necessário
      });

      console.log("Resposta do login:", response.data);

      if (response.data) {
        let userData;
        
        // Verificar se há token na resposta
        if (response.data.token) {
          const decoded = decodeJwtPayload(response.data.token);
          const role = decoded?.role || "USER";
          
          userData = {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: role,
            token: response.data.token,
            authenticated: true,
          };
        } else {
          // Caso não tenha token
          userData = {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: response.data.role || "USER",
            authenticated: true,
          };
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.error("Erro detalhado ao fazer login:", error);
      
      // Tratamento mais específico de erros
      if (error.code === 'ERR_NETWORK') {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else if (error.response) {
        // Erro da API
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       "Credenciais inválidas";
        setError(message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Decodifica payload do JWT
  const decodeJwtPayload = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error("Erro ao decodificar o token JWT:", e);
      return null;
    }
  };

  // Recupera usuário do localStorage - Remover este useEffect duplicado
  // já está sendo feito no AuthProvider
  /*
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.authenticated) {
          parsedUser.authenticated = true;
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e);
        localStorage.removeItem("user");
      }
    }
  }, [setUser]);
  */

  // Redireciona para perfil se autenticado
  if (user && user.authenticated) {
    return <Profile />;
  }

  return (
    <div className="login-container">
      <div className="cabecalho-img">
        <img src={logo} alt="Logo" />
      </div>

      <div className="login-box">
        <div className="cabecalho-login">
          <div className="cabecalho-text">
            <h1>Seja Bem-Vindo!</h1>
            <p>Preencha seus dados para acessar a plataforma</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }} // Removido role se não necessário
          onSubmit={handleClickLogin}
          validationSchema={validationLogin}
        >
          <Form className="login-form">
            <div className="login-form-group">
              <p>E-mail *</p>
              <Field name="email" type="email" className="form-field" />
              <ErrorMessage component="span" name="email" className="form-error" />
            </div>

            <div className="login-form-group">
              <p>Senha *</p>
              <Field type="password" name="password" className="form-field" />
              <ErrorMessage component="span" name="password" className="form-error" />
            </div>

            <div className="options-login">
              <label>
                <input type="checkbox" name="remember" />
                Lembre de mim
              </label>
              <a href="/EsqueceuSenha">
                <p>Esqueceu a senha?</p>
              </a>
            </div>

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? "Carregando..." : "LOGIN"}
            </button>

            <div className="divider-login">
              <span>ou</span>
            </div>
            
          </Form>
        </Formik>

        <div className="google">
          <button className="google-button" type="button">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: "20px", marginRight: "38px" }}
            />
            Entre com Google
          </button>
        </div>

        <div className="register-link">
          <a href="/Register">
            <p>
              Não tem conta ainda? <strong>Registre-se</strong>
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;