import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

// URL da API
const API_URL = "http://localhost:8080";

// Interface da pergunta
interface Question {
  id: string;
  texto: string;
  categoria: string;
  peso: number;
  tamanhosPermitidos: string[];
  publicoAlvo: string;
}

const Questionario = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [error, setError] = useState<string>("");

  // Buscar perguntas da API ao montar o componente
  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await Axios.get(`${API_URL}/perguntas`);
        setPerguntas(response.data);
      } catch (err) {
        console.error("Erro ao buscar perguntas:", err);
        setError("Erro ao carregar perguntas.");
      }
    };

    fetchPerguntas();
  }, []);

  return (
    <div className="questionario-container">
      <div className="questionario-box">
        <div className="cabecalho-login">
          <div className="cabecalho-text">
            <h1>Questionário ESG!</h1>
            <p>Preencha seus dados para acessar a plataforma</p>
          </div>
        </div>

        <Formik
          initialValues={{ resposta1: "", gender: "" }}
          onSubmit={(values) => {
            console.log("Respostas enviadas:", values);
          }}
          validationSchema={null}
        >
          <Form className="login-form">
            {perguntas.map((p, index) => (
              <div className="login-form-group" key={p.id}>
                <p>Pergunta {index + 1}: {p.texto}</p>
                <Field
                  name={`resposta${index + 1}`}
                  className="form-field"
                />
                <ErrorMessage
                  component="span"
                  name={`resposta${index + 1}`}
                  className="form-error"
                />
              </div>
            ))}

            <button className="register-button" type="submit">
              ENVIAR
            </button>

            {error && <div className="form-error">{error}</div>}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Questionario;
