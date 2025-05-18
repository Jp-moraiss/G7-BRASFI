import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import Profile from "./Profile";
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo  from "../../image/logoBRASFI.png";


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


const EditProfile: React.FC = () => {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
              try {
                  const parsedUser = JSON.parse(storedUser);
                  setUserEmail(parsedUser.email || parsedUser.login || "");
                  setUser(parsedUser.name)
                  setIsAuthenticated(true);
                  console.log("Dados do usuário carregados:", parsedUser);
              } catch (error) {
                  console.error("Erro ao carregar dados do usuário:", error);
              }
          } else {
              console.log("Nenhum usuário encontrado no localStorage");
          }
      }, []);

  return (
    <div className="password-container">
      <div className="password-box">
        <div className="cabecalho-edit">
          <div className="cabecalho-edit-img">
            <img src={logo} alt="" />
          </div>
          <div className="cabecalho-edit-text">
            <h1>Atualizar seus Dados </h1>
            <p>Preencha seus dados para atualizar os dados</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Formik
          initialValues={{ email: "", password: "" }}>
          <Form className="edit-form">
            <div className="edit-form-group">
              <p>Nome *</p>
              <input className="input-edit" placeholder={user} type="text" />
              <ErrorMessage component="span" name="email" className="form-error" />
            </div>
             <div className="edit-form-group">
              <p>E-mail *</p>
              <input className="input-edit" placeholder={userEmail} type="text" />
              <ErrorMessage component="span" name="email" className="form-error" />
            </div>

            <button className="register-button" type="submit">
              {'SALVAR'}
            </button>

          </Form>
        </Formik>

      </div>
    </div>
  );
};

export default EditProfile;