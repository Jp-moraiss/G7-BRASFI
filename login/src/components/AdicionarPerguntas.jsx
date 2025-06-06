import React, { useRef, useState, useEffect } from 'react';
import Home from './Home';

const AdicionarPerguntas = () => {
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');
  const [publicoAlvo, setpublicoAlvo] = useState('');
  const [peso, setPeso] = useState();
  const [mensagem, setMensagem] = useState();
  const [tipoMensagem, setTipoMensagem] = useState();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setIsAdmin(parsedUser.role === 'ADMIN');
          console.log("Dados do usuário carregados:", parsedUser);
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      } else {
        console.log("Nenhum usuário encontrado no localStorage");
      }
    }, []);

    {!isAdmin && (
      <Home />
    )}
  
  const handleSubmit = async () => {
    setMensagem(null);

    if (!texto || !categoria || !peso || !publicoAlvo) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const perguntas = {
      texto,
      categoria,
      peso,
      publicoAlvo,
    };

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/perguntas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(perguntas)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar Pergunta');

      const data = await response.json();
      console.log('Pergunta cadastrada:', data);

      setMensagem('Pergunta cadastrada com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Falha ao cadastrar a pergunta.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div style={{backgroundColor: 'white'}}>
    <div className='perguntas-container' >
      <div className="box-adicionar-curso" >
        <div className="cabecalho-adicionar-curso">
          <h1>Adicionar Perguntas no Questionnario</h1>
          <p>Preencha os dados para adicionar perguntas</p>
        </div>

        <div className="input-curso-area">
          <div className="input-descrição-box">
            <p>Digite a Pergunta *</p>
            <input
              type='text'
              placeholder="Digite a Pergunta"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <label>
              <p>Informe a Categoria *</p>
              <select onChange={(e) => setCategoria(e.target.value)}>
                <option value="AMBIENTAL">Ambiental</option>
                <option value="SOCIAL">Social</option>
                <option value="GOVERNANCA">Governanca</option>
              </select>
            </label>
          </div>
          <div className="input-descrição-box">
            <label>
              <p>Informe o Peso *</p>
              <select onChange={(e) => setPeso(Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
          </div>
          <div className="input-descrição-box">
            <label>
              <p>Informe o Publico Alvo *</p>
              <select onChange={(e) => setpublicoAlvo(e.target.value)}>
                <option value="MICRO">Micro</option>
                <option value="PEQUENA">Pequena</option>
                <option value="MEDIA">Media</option>
              </select>
            </label>
          </div>
          
        </div>
        {mensagem && (
          <div className={`mensagem ${tipoMensagem}`}>
            {mensagem}
          </div>
        )}
        <button className="register-button" onClick={handleSubmit}>
          SALVAR
        </button>
      </div>
    </div>
    </div>
  );
};

export default AdicionarPerguntas;
