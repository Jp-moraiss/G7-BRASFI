import React, { useState } from 'react';

const AdicionarCapitulos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [id, setId] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | null>(null);

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
      setMensagem('Capitulo cadastrado com sucesso!');
      setTipoMensagem('sucesso');
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
            <p>Id do Curso *</p>
            <input
              type='text'
              placeholder="Digite o Id do Curso"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
    </div>
  );
};

export default AdicionarCapitulos;
