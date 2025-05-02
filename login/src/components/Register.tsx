import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';


// URL da API para o Railway
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

const Register: React.FC = () => {
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

  const handleClickLogin = async (values: { email: string; password: string }) => {
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
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setError(error.response?.data?.message || 'Credenciais inválidas');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleClickRegister = async (values: { email: string; password: string; confirmPassword: string }) => {
    try {
      const response = await Axios.post(`${API_URL}/register`, {
        email: values.email,
        password: values.password
      });
      
      alert(response.data.msg || "Registro realizado com sucesso!");
      
      if (response.data.success) {
        document.getElementById("register-form")!.style.display = "none";
      }
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar usuário: " + (error.response?.data?.msg || error.message));
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
            <h1>Cadastre-se!</h1>
            <p>Preencha seus dados para criar sua conta</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleClickLogin}
          validationSchema={validationLogin}
        >
          <Form className="registration-form">
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <p>Nome Completo</p> <span className="required">*</span>
                    </label>
                    <Field 
                      id="fullName" 
                      name="fullName" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="fullName" className="form-error" />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <p>Telefone</p> <span className="required">*</span>
                    </label>
                    <Field 
                      id="phone" 
                      name="phone" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="phone" className="form-error" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="cpf">
                      <p>CPF</p> <span className="required">*</span>
                    </label>
                    <Field 
                      id="cpf" 
                      name="cpf" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="cpf" className="form-error" />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>
                      <p>Genero</p> <span className="required">*</span>
                    </label>
                    <div className="options-login">
                      <label >
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Homem" 
                          className="radio-input" 
                        />
                        Homem
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Mulher" 
                          className="radio-input" 
                        />
                        Mulher
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Outro" 
                          className="radio-input" 
                        />
                        Outro
                      </label>
                    </div>
                    <ErrorMessage component="span" name="gender" className="form-error" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="birthDate">
                      <p>Data de Nascimento</p> <span className="required">*</span>
                    </label>
                    <Field 
                      id="birthDate" 
                      name="birthDate" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="birthDate" className="form-error" />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="password">
                      <p>Senha</p> <span className="required">*</span>
                    </label>
                    <Field 
                      type="password" 
                      id="password" 
                      name="password" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="password" className="form-error" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="email">
                      <p>E-mail</p> <span className="required">*</span>
                    </label>
                    <Field 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="email" className="form-error" />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <p>Confirmar Senha</p> <span className="required">*</span>
                    </label>
                    <Field 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      className="form-field" 
                    />
                    <ErrorMessage component="span" name="confirmPassword" className="form-error" />
                  </div>
                </div>
              </div>

              <button className="register-button" type="submit">
                REGISTRAR
              </button>
            </Form>
          
        </Formik>

      <div className="register-link">
        <a href="/Login"><p>Ja tem uma Conta ? <strong>Entrar</strong> </p></a>
      </div>

        <div id="register-form" style={{ display: "none" }}>
          <h2>Registrar</h2>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            onSubmit={handleClickRegister}
            validationSchema={validationRegister}
          >
            <Form className="login-form">
              <div className="login-form-group">
                <i className="fas fa-envelope"></i>
                <Field name="email" className="form-field" placeholder="Email" />
                <ErrorMessage component="span" name="email" className="form-error" />
              </div>

              <div className="login-form-group">
                <i className="fas fa-lock"></i>
                <Field type="password" name="password" className="form-field" placeholder="Senha" />
                <ErrorMessage component="span" name="password" className="form-error" />
              </div>

              <div className="login-form-group">
                <i className="fas fa-lock"></i>
                <Field type="password" name="confirmPassword" className="form-field" placeholder="Confirmar Senha" />
                <ErrorMessage component="span" name="confirmPassword" className="form-error" />
              </div>

              <button className="login-button" type="submit">
                REGISTRAR
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;