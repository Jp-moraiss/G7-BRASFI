import React, { useState } from 'react';

const AdicionarCapitulos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = async () => {
    if (!titulo || !descricao || !id) {
      alert('Preencha todos os campos!');
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
      const response = await fetch('http://localhost:8080/capitulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(capitulos)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar capitulo');

      const data = await response.json();
      console.log('Capitulo cadastrado:', data);
      alert('Capitulo cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao cadastrar o Capitulo.');
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
          <div className="input-titulo-box">
            <p>Título *</p>
            <input
              placeholder="Digite o Título"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Descrição *</p>
            <input
              placeholder="Digite a Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Id do Curso *</p>
            <input
              placeholder="Digite o Id do Curso"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          
        </div>
        <button className="register-button" onClick={handleSubmit}>
          SALVAR
        </button>
      </div>
    </div>
  );
};

export default AdicionarCapitulos;
