import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import icon from "../../image/icon.png";

// URL da API - Configurar baseado no ambiente
const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://g7-brasfi.onrender.com" 
  : "http://localhost:8080"; // ou a porta do seu backend local

// Configurar Axios globalmente
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

// Contexto de autenticação
export const AuthContext = createContext();

// Provedor de autenticação
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

// Validação do formulário de registro
const validationRegisterFull = yup.object().shape({
  fullName: yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Campo obrigatório'),
  phone: yup.string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999')
    .required('Campo obrigatório'),
  cpf: yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato: 000.000.000-00')
    .required('Campo obrigatório'),
  gender: yup.string().required('Campo obrigatório'),
  birthDate: yup.date()
    .max(new Date(), 'Data não pode ser futura')
    .required('Campo obrigatório'),
  email: yup.string()
    .email('E-mail inválido')
    .required('Campo obrigatório'),
  password: yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Campo obrigatório'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Senhas não coincidem')
    .required('Campo obrigatório'),
  role: yup.string().oneOf(["0", "1"]).required("Campo obrigatório"),
  adminSecret: yup.string().when("role", {
    is: "0", // Admin
    then: (schema) => schema.required("Senha secreta obrigatória para admin")
                          .test('is-correct-secret', 'Senha secreta incorreta', 
                             value => value === 'supersecreta'),
    otherwise: (schema) => schema.notRequired()
  })
});

// Componente de registro
const Register = () => {
  const [localUser, setLocalUser] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authContext = useContext(AuthContext);
  const user = authContext?.user || localUser;
  const setUser = authContext?.setUser || setLocalUser;
  const loading = authContext?.loading || localLoading;
  const setLoading = authContext?.setLoading || setLocalLoading;

  // Função para o registro do usuário
  const handleClickRegister = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log("Tentando registrar usuário...", { email: values.email, role: values.role });

      const requestData = {
        login: values.email,
        password: values.password,
        role: values.role === "0" ? "ADMIN" : "USER",
        name: values.fullName,
        phone: values.phone,
        cpf: values.cpf,
        dataNascimento: values.birthDate,
        genero: values.gender,
        biografia: ""
      };

      // Adicionar adminSecret apenas se for admin
      if (values.role === "0") {
        requestData.adminSecret = values.adminSecret;
      }

      console.log("Dados enviados:", requestData);

      const response = await Axios.post(`${API_URL}/auth/register`, requestData);

      console.log("Resposta do registro:", response.data);

      setSuccess("Registro realizado com sucesso!");

      // Verificar se o registro foi bem-sucedido
      if (response.status === 200 || response.status === 201) {
        // Dados do usuário registrado
        const userData = {
          id: response.data.id,
          email: values.email,
          name: values.fullName,
          role: values.role === "0" ? "ADMIN" : "USER",
          authenticated: true,
        };

        // Se houver token na resposta, incluir
        if (response.data.token) {
          userData.token = response.data.token;
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Limpar formulário após sucesso
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }

    } catch (error) {
      console.error("Erro detalhado ao registrar:", error);
      
      // Tratamento mais específico de erros
      if (error.code === 'ERR_NETWORK') {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else if (error.response) {
        // Erro da API
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       "Erro ao registrar usuário";
        setError(message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar CPF
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

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
        {success && <p className="success-message">{success}</p>}

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
            adminSecret: '' // Deixar vazio inicialmente
          }}
          onSubmit={handleClickRegister}
          validationSchema={validationRegisterFull}
        >
          {({ values, setFieldValue }) => (
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
                    <Field 
                      id="phone" 
                      name="phone" 
                      className="form-field"
                      placeholder="(11) 99999-9999"
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
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        setFieldValue('cpf', formatted);
                      }}
                      placeholder="000.000.000-00"
                    />
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

              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="birthDate">
                      <p>Data de Nascimento</p> <span className="required">*</span>
                    </label>
                    <Field 
                      type="date" 
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

              <button 
                className="register-button" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Registrando..." : "REGISTRAR"}
              </button>
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