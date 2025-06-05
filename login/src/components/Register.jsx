import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import icon from "../../image/icon.png";

// URL da API para o Railway
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


// Contexto de autenticação
export const AuthContext = createContext();

// Provedor de autenticação
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

// Validação do formulário de registro
const validationRegisterFull = yup.object().shape({
  fullName: yup.string().required('Campo obrigatório'),
  phone: yup.string().required('Campo obrigatório'),
  cpf: yup.string().required('Campo obrigatório'),
  gender: yup.string().required('Campo obrigatório'),
  birthDate: yup.string().required('Campo obrigatório'),
  email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Campo obrigatório'),
  role: yup.string().oneOf(["0", "1"]).required("Campo obrigatório"),
  adminSecret: yup.string().when("role", {
    is: "0", // Admin
    then: () => yup.string().required("Senha secreta obrigatória para admin")
                 .test('is-correct-secret', 'Senha secreta incorreta', 
                    value => value === 'supersecreta'),
    otherwise: () => yup.string().notRequired()
  })
});

// Componente de registro
const Register = () => {
  const [localUser, setLocalUser] = useState();
  const [localLoading, setLocalLoading] = useState();
  const [error, setError] = useState('');

  const authContext = useContext(AuthContext);
  const user = authContext?.user || localUser;
  const setUser = authContext?.setUser || setLocalUser;
  const loading = authContext?.loading || localLoading;
  const setLoading = authContext?.setLoading || setLocalLoading;

  // Função para o registro do usuário
  const handleClickRegister = async (values) => {
    setLoading(true);
    try {
      const requestData = {
        login: values.email,
        password: values.password,
        role: values.role === "0" ? "ADMIN" : "USER", // Converter para ADMIN/USER
        name: values.fullName,
        phone: values.phone,
        cpf: values.cpf,
        adminSecret: values.adminSecret,
        dataNascimento: values.birthDate,
        genero: values.gender,
        biografia: ""
      };

      // Adicionar adminSecret apenas se for admin
      if (values.role === "0") {
        requestData.adminSecret = values.adminSecret;
      }

      const response = await Axios.post(`${API_URL}/auth/register`, requestData);

      alert("Registro realizado com sucesso!");

      if (response.status === 200) {
        const savedUser = {
          email: values.email,
          authenticated: true,
          role: values.role === "0" ? "ADMIN" : "USER"
        };

        localStorage.setItem('user', JSON.stringify(savedUser));
        setUser(savedUser);
      }

    } catch (error) {
      console.error("Erro ao registrar:", error);
      setError("Erro ao registrar usuário: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Verificação do usuário autenticado
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

  // Se o usuário já está autenticado, redireciona para o perfil
  if (user && user.authenticated) {
    return <Profile />;
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="cabecalho-register">
          <div className="cabecalho-icon">
            <img src={icon} alt="Ícone de logo" />
          </div>
          <div className="cabecalho-text-register">
            <h1>Cadastre-se!</h1>
            <p>Preencha seus dados para criar sua conta</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{
            fullName: '',
            phone: '',
            cpf: '',
            gender: '',
            birthDate: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '1', // valor inicial como USER (1)
            adminSecret: 'supersecreta' // Valor padrão para adminSecret
          }}
          onSubmit={handleClickRegister}
          validationSchema={validationRegisterFull}
        >
          {({ values }) => (
            <Form className="registration-form">
              {/* Campo Nome Completo */}
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <p>Nome Completo</p> <span className="required">*</span>
                    </label>
                    <Field id="fullName" name="fullName" className="form-field" />
                    <ErrorMessage component="span" name="fullName" className="form-error" />
                  </div>
                </div>
                {/* Campo Telefone */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <p>Telefone</p> <span className="required">*</span>
                    </label>
                    <Field id="phone" name="phone" className="form-field" />
                    <ErrorMessage component="span" name="phone" className="form-error" />
                  </div>
                </div>
              </div>

              {/* Demais campos do formulário */}
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="cpf">
                      <p>CPF</p> <span className="required">*</span>
                    </label>
                    <Field id="cpf" name="cpf" className="form-field" />
                    <ErrorMessage component="span" name="cpf" className="form-error" />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>
                      <p>Gênero</p> <span className="required">*</span>
                    </label>
                    <div className="options-login">
                      <label>
                        <Field type="radio" name="gender" value="Homem" className="radio-input" />
                        Homem
                      </label>
                      <label className="radio-label">
                        <Field type="radio" name="gender" value="Mulher" className="radio-input" />
                        Mulher
                      </label>
                      <label className="radio-label">
                        <Field type="radio" name="gender" value="Outro" className="radio-input" />
                        Outro
                      </label>
                    </div>
                    <ErrorMessage component="span" name="gender" className="form-error" />
                  </div>
                </div>
              </div>

              {/* Campos adicionais para o formulário */}
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="birthDate">
                      <p>Data de Nascimento</p> <span className="required">*</span>
                    </label>
                    <Field id="birthDate" name="birthDate" className="form-field" />
                    <ErrorMessage component="span" name="birthDate" className="form-error" />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="password">
                      <p>Senha</p> <span className="required">*</span>
                    </label>
                    <Field type="password" id="password" name="password" className="form-field" />
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
                    <Field type="email" id="email" name="email" className="form-field" />
                    <ErrorMessage component="span" name="email" className="form-error" />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <p>Confirmar Senha</p> <span className="required">*</span>
                    </label>
                    <Field type="password" id="confirmPassword" name="confirmPassword" className="form-field" />
                    <ErrorMessage component="span" name="confirmPassword" className="form-error" />
                  </div>
                </div>
              </div>

              {/* Tipo de conta */}
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="role">
                      <p>Tipo de Conta</p> <span className="required">*</span>
                    </label>
                    <Field as="select" id="role" name="role" className="form-field">
                      <option value="1">Usuário</option>
                      <option value="0">Administrador</option>
                    </Field>
                    <ErrorMessage component="span" name="role" className="form-error" />
                  </div>
                </div>
              </div>

              {/* Senha secreta para admin */}
              {values.role === '0' && (
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label htmlFor="adminSecret">
                        <p>Senha Secreta do Admin</p> <span className="required">*</span>
                      </label>
                      <Field
                        type="password"
                        id="adminSecret"
                        name="adminSecret"
                        className="form-field"
                        placeholder="Digite 'supersecreta'"
                      />
                      <small className="form-hint">Dica: A senha é 'supersecreta'</small>
                      <ErrorMessage component="span" name="adminSecret" className="form-error" />
                    </div>
                  </div>
                </div>
              )}

              <button className="register-button" type="submit">
                REGISTRAR
              </button>

              {error && (
                <div className="form-error-box">
                  {error}
                </div>
              )}
            </Form>
          )}
        </Formik>

        <div className="register-link">
          <a href="/Login"><p>Já tem uma Conta? <strong>Entrar</strong></p></a>
        </div>
      </div>
    </div>
  );
};

export default Register;
