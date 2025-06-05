import React, { useState, useEffect } from 'react';

const QuestionarioESG = () => {
  const [empresa, setEmpresa] = useState({ nome: '', tamanho: 'MICRO' });
  const [empresaStatus, setEmpresaStatus] = useState('');
  const [empresaSalva, setEmpresaSalva] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [isAdmin, setIsAdmin] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
      // Carregar usuário
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const email = parsedUser.email || parsedUser.login || "";
          setUserEmail(email);
          setIsAuthenticated(true);
          setIsAdmin(parsedUser.role === "admin" || parsedUser.role === "ADMIN");
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      }})
      

  const cadastrarEmpresa = async () => {
    try {
      const response = await fetch('https://g7-brasfi.onrender.com/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa),
      });

      const data = await response.json();
      setEmpresaSalva(data);
      buscarPerguntas();
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      setEmpresaStatus('Erro ao cadastrar empresa.');
    }
  };

  const buscarPerguntas = async () => {
    try {
      const response = await fetch(`https://g7-brasfi.onrender.com/perguntas`);
      const data = await response.json();
      setPerguntas(data);
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    }
  };

  const enviarRespostas = async () => {
    try {
      for (const pergunta of perguntas) {
        const input = document.querySelector(`input[name="resposta-${pergunta.id}"]`);
        const respostaTexto = input ? input.value : '';

        await fetch('https://g7-brasfi.onrender.com/respostas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            empresa: { id: empresaSalva.id },
            pergunta: { id: pergunta.id },
            respostaTexto,
          }),
        });
      }
      alert('Respostas enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  return (
    <div className='questionary-container'>
      <div className="box-questionario">
        <h1>Questionário ESG</h1>
        <h2>Cadastrar Empresa</h2>

        <label>
          Nome:
          <input
            type="text"
            value={empresa.nome}
            onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
          />
        </label>
        <br />
        <label>
          Tamanho:
          <select
            value={empresa.tamanho}
            onChange={(e) => setEmpresa({ ...empresa, tamanho: e.target.value })}
          >
            <option value="MICRO">MICRO</option>
            <option value="PEQUENA">PEQUENA</option>
            <option value="MEDIA">MÉDIA</option>
            <option value="GRANDE">GRANDE</option>
          </select>
        </label>
        <br />
        <div className="button-questionary">
          <button onClick={cadastrarEmpresa}>Cadastrar</button>
          
          {isAdmin && (
            <a href="/AdicionarPerguntas"><button>Cadastrar Perguntas</button></a>
          )}
          
        </div>
      </div>
      <p>{empresaStatus}</p>

      {perguntas.length > 0 && (
        <>
          <h2>2. Responder Perguntas</h2>
          <div id="perguntasContainer">
            {perguntas.map((p) => (
              <div key={p.id}>
                <label>
                  <strong>{p.texto}</strong> (Categoria: {p.categoria}, Peso: {p.peso})
                </label>
                <br />
                <input type="text" name={`resposta-${p.id}`} placeholder="Sua resposta" />
                <br />
                <br />
              </div>
            ))}
          </div>
          <button onClick={enviarRespostas}>Enviar Respostas</button>
        </>
      )}
    </div>
  );
};

export default QuestionarioESG;
