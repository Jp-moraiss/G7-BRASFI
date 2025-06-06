import React, { useState, useEffect } from 'react';

const QuestionarioESG = () => {
  const [empresa, setEmpresa] = useState({ nome: '', tamanho: 'MICRO' });
  const [empresaStatus, setEmpresaStatus] = useState('');
  const [empresaSalva, setEmpresaSalva] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [isAdmin, setIsAdmin] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // respostas separadas por ID de pergunta
  const [respostas, setRespostas] = useState({});
  const [respostasOutras, setRespostasOutras] = useState({});

  useEffect(() => {
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
    }
    buscarPerguntas();
  }, []);

  const cadastrarEmpresa = async () => {
    try {
      const response = await fetch('https://g7-brasfi.onrender.com/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa),
      });

      const data = await response.json();
      setEmpresaSalva(data);
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
      for (const pergunta of perguntasFiltradas) {
        const respostaSelecionada = respostas[pergunta.id] || '';
        const textoOutro = respostasOutras[pergunta.id] || '';
        const respostaFinal = respostaSelecionada === 'Outro' ? textoOutro : respostaSelecionada;

        await fetch('https://g7-brasfi.onrender.com/respostas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            empresa: { id: empresaSalva.id },
            pergunta: { id: pergunta.id },
            respostaTexto: respostaFinal,
          }),
        });
      }
      alert('Respostas enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  const perguntasFiltradas = perguntas.filter(
    (p) => p.publicoAlvo === empresa.tamanho
  );

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

      {empresaSalva && perguntasFiltradas.length > 0 && (
        <>
          <h2>2. Responder Perguntas</h2>
          <div id="perguntasContainer">
            {perguntasFiltradas.map((p) => (
              <div key={p.id}>
                <label>
                  <strong>{p.texto}</strong> (Categoria: {p.categoria}, Peso: {p.peso}, Público Alvo: {p.publicoAlvo})
                </label>
                <br />
                <select
                  name={`resposta-${p.id}`}
                  value={respostas[p.id] || ''}
                  onChange={(e) =>
                    setRespostas(prev => ({ ...prev, [p.id]: e.target.value }))
                  }
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                  <option value="Outro">Outro</option>
                </select>

                {respostas[p.id] === 'Outro' && (
                  <>
                    <br />
                    <input
                      type="text"
                      name={`resposta-outro-${p.id}`}
                      placeholder="Descreva sua resposta"
                      value={respostasOutras[p.id] || ''}
                      onChange={(e) =>
                        setRespostasOutras(prev => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                    />
                  </>
                )}
                <br /><br />
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
