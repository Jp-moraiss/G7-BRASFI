import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';


// URL da API para o Railway
const API_URL = "http://localhost:8080";

// Definição de tipos
interface User {
  id?: string;
  name?: string;
  email: string;
  authenticated?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => void;
}

// Criação do contexto de autenticação
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

const Login: React.FC = () => {
  // Estado local para controle do usuário
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Tenta usar o contexto se disponível
  const authContext = useContext(AuthContext);
  
  // Determina quais funções usar (do contexto ou locais)
  const user = authContext?.user || localUser;
  const setUser = authContext?.setUser || setLocalUser;
  const loading = authContext?.loading || localLoading;
  const setLoading = authContext?.setLoading || setLocalLoading;

  const validationLogin = yup.object().shape({
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("Campo obrigatório"),
  });


  const handleClickLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
  
    try {
      const response = await Axios.post(`${API_URL}/auth/login`, {
        login: values.email,
        password: values.password,
      });
  
      if (response.data) {
        const token = response.data.token;
        const decoded = decodeJwtPayload(token);
        const role = decoded?.role || "USER"; // <- extraído do token, se existir
  
        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          token: token,
          role: role, // <- agora incluído
          authenticated: true,
        };
  
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setError(error.response?.data?.message || 'Credenciais inválidas');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const decodeJwtPayload = (token: string) => {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error("Erro ao decodificar o token JWT:", e);
      return null;
    }
  };

  // Verifica se o usuário já está autenticado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Garantir que tenha a propriedade authenticated
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

 
  // Renderiza o componente de perfil se o usuário estiver autenticado
  if (user && user.authenticated) {
    return <Profile />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="cabecalho-login">
          <div className="cabecalho-text">
            <h1>Seja Bem Vindo!</h1>
            <p>Preencha seus dados para acessar a plataforma</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }}
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
              <Field type="password" name="password" className="form-field"/>
              <ErrorMessage component="span" name="password" className="form-error" />
            </div>

            <div className="options-login">
            <label>
              <input type="checkbox" name="remember" />
              Lembre de mim
            </label>
              <a href="/EsqueceuSenha"><p>Esqueceu a senha ?</p></a>
            </div>

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'LOGIN'}
            </button>

            <div className="divider">
              <span>ou</span>
            </div>
          </Form>
        </Formik>

      <div className="google">
        <button className="google-button">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: '20px', marginRight: '38px' }}/>
          Entre com Google
        </button>
      </div>

      <div className="register-link">
        <a href="/Register"><p>Não Tem conta ainda ? <strong>Registre-se</strong> </p></a>
      </div>
      
      </div>
    </div>
  );
};

export default Login;