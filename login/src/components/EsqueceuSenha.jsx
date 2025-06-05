import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo  from "../../image/logoBRASFI.png";


// URL da API para o Railway
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

const EsqueceuSenha = () => {
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

  const validationRegister = yup.object().shape({
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("Campo obrigatório"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "As senhas devem ser iguais").required("Campo obrigatório"),
  });

  const handleClickLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await Axios.post(`${API_URL}/auth/login`, values);
      
      if (response.data) {
        // Garantir que o usuário tenha a propriedade authenticated
        const userData = {
          ...response.data,
          authenticated: true
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(error.response?.data?.message || 'Credenciais inválidas');
      return false;
    } finally {
      setLoading(false);
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
    <div className="password-container">
      <div className="password-box">
        <div className="cabecalho-login">
          <div className="cabecalho-img">
            <img src={logo} alt="" />
          </div>
          <div className="cabecalho-text">
            <h1>Esqueceu sua senha?</h1>
            <p>Preencha seus dados para recuperar sua senha</p>
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

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'LOGIN'}
            </button>

          </Form>
        </Formik>


      <div className="register-link">
        <a href="/Register"><p>Não Tem conta ainda ? <strong>Registre-se</strong> </p></a>
      </div>

      </div>
    </div>
  );
};

export default EsqueceuSenha;