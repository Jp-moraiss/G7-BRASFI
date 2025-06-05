import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";

import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../image/logoBRASFI.png";

// URL da API
const API_URL = "http://localhost:8080";


// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
  const [localUser, setLocalUser] = useState();
  const [localLoading, setLocalLoading] = useState();
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
      const response = await Axios.post(`${API_URL}/auth/login`, {
        login: values.email,
        password: values.password,
        role: values.role
      });

      if (response.data) {
        const token = response.data.token;
        const decoded = decodeJwtPayload(token);
        const role = decoded?.role || "USER";

        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: role,
          authenticated: true,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(error.response?.data?.message || "Credenciais inválidas");
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

  // Recupera usuário do localStorage
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
          initialValues={{ email: "", password: "", role: "" }}
          onSubmit={handleClickLogin}
          validationSchema={validationLogin}
        >
          <Form className="login-form">
            <div className="login-form-group">
              <p>E-mail *</p>
              <Field name="email" className="form-field" />
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

            <div className="divider">
              <span>ou</span>
            </div>
          </Form>
        </Formik>

        <div className="google">
          <button className="google-button">
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