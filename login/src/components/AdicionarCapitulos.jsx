import React, { useState, useEffect } from 'react';

const AdicionarCapitulos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [id, setId] = useState('');
  const [mensagem, setMensagem] = useState();
  const [tipoMensagem, setTipoMensagem] = useState();
  const [cursos, setCursos] = useState([]);

  // 🔥 Pega os cursos ao carregar a página
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('https://g7-brasfi.onrender.com/cursos');
        if (!response.ok) throw new Error('Erro ao buscar cursos');
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setMensagem('Erro ao carregar cursos');
        setTipoMensagem('erro');
      }
    };

    fetchCursos();
  }, []);

  const handleSubmit = async () => {
    if (!titulo || !descricao || !id) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const capitulos = {
      titulo,
      descricao,
      curso: {
        id: id,
      },
    };

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/capitulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(capitulos)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar capitulo');

      const data = await response.json();
      console.log('Capitulo cadastrado:', data);
      setMensagem('Capitulo cadastrado com sucesso!');
      setTipoMensagem('sucesso');

      // Limpa os campos
      setTitulo('');
      setDescricao('');
      setId('');
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Erro ao Cadastrar Capitulo!');
      setTipoMensagem('erro');
    }
  };

  return (
    <div>
      <div className="box-adicionar-curso">
        <div className="cabecalho-adicionar-curso">
          <h1>Adicionar Capitulos</h1>
          <p>Preencha os dados para adicionar um capitulo em um curso</p>
        </div>
        <div className="input-curso-area">
          <div className="input-descrição-box">
            <p>Título *</p>
            <input
              type='text'
              placeholder="Digite o Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Descrição *</p>
            <input
              type='text'
              placeholder="Digite a Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Curso *</p>
            <select value={id} onChange={(e) => setId(e.target.value)}>
              <option value="">Selecione um curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.titulo}
                </option>
              ))}
            </select>
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
  );
};

export default AdicionarCapitulos;
