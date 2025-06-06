import React, { useState, useEffect } from 'react';
import Home from './Home';

const AlterarLandPage = () => {
  const [landpage, setLandpage] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
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

  useEffect(() => {
    buscarInformacoes();
  }, []);

  const buscarInformacoes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/landpages`);
      const data = await response.json();
      setLandpage(data);
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
    }
  };

  const handleChange = (index, field, value) => {
    const novaLandpage = [...landpage];
    novaLandpage[index][field] = value;
    setLandpage(novaLandpage);
  };

  const handleSubmit = async () => {
    try {
      for (const item of landpage) {
        await fetch(`http://localhost:8080/landpages/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });
      }
      setMensagem('Alterações salvas com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMensagem('Erro ao salvar alterações.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div>
      {landpage.map((p, index) => (
        <div className="box-adicionar-curso" style={{'marginTop': "200px"}} key={p.id}>
          <div className="cabecalho-adicionar-curso">
            <h1>Alterar LandPage</h1>
            <p>Preencha os dados para alterar a landpage</p>
          </div>
          <div className="input-curso-area">
            <div className="input-descrição-box">
              <p>Título da Brasfi *</p>
              <input
                type='text'
                value={p.tituloBrasfi}
                onChange={(e) => handleChange(index, 'tituloBrasfi', e.target.value)}
              />
            </div>
            <div className="input-descrição-box">
              <p>História Brasfi *</p>
              <input
                type='text'
                value={p.historiaBrasfi}
                onChange={(e) => handleChange(index, 'historiaBrasfi', e.target.value)}
              />
            </div>
            <div className="input-descrição-box">
              <p>Hub Projetos *</p>
              <input
                type='text'
                value={p.hubProjetos}
                onChange={(e) => handleChange(index, 'hubProjetos', e.target.value)}
              />
            </div>
            <div className="input-descrição-box">
              <p>Hub Networking *</p>
              <input
                type='text'
                value={p.hubNetworking}
                onChange={(e) => handleChange(index, 'hubNetworking', e.target.value)}
              />
            </div>
            <div className="input-descrição-box">
              <p>Recrutamento *</p>
              <input
                type='text'
                value={p.recrutamento}
                onChange={(e) => handleChange(index, 'recrutamento', e.target.value)}
              />
            </div>
            <div className="input-descrição-box">
              <p>Questionário *</p>
              <input
                type='text'
                value={p.questionario}
                onChange={(e) => handleChange(index, 'questionario', e.target.value)}
              />
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
      ))}
    </div>
  );
};

export default AlterarLandPage;
