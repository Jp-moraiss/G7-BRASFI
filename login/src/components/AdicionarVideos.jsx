import React, { useState } from 'react';

const AdicionarVideos = () => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [id, setId] = useState('');
  const [mensagem, setMensagem] = useState();
  const [tipoMensagem, setTipoMensagem] = useState();

  const handleSubmit = async () => {
    if (!titulo || !url || !id) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const capitulos = {
      titulo,
      url,
      capitulo: {
        id: id,
      },
    };

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(capitulos)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar Video');

      const data = await response.json();
      console.log('Video cadastrado:', data);
      setMensagem('Video adicionado com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Falha ao Adicionar Video!');
      setTipoMensagem('erro');
    }
  };

  return (
    <div>
      <div className="box-adicionar-curso">
        <div className="cabecalho-adicionar-curso">
          <h1>Adicionar Videos</h1>
          <p>Preencha os dados para adicionar um video em um capitulo</p>
        </div>
        <div className="input-curso-area">
          <div className="input-descrição-box">
            <p>Título *</p>
            <input
              type='text'
              placeholder="Digite o Título do Video"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Url do Video *</p>
            <input
              type='text'
              placeholder="Digite a Url do Video"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="input-descrição-box">
            <p>Id do Capitulo *</p>
            <input
              type='text'
              placeholder="Digite o Id do Capitulo"
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

export default AdicionarVideos;
