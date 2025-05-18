import React, { useState } from 'react';

const AdicionarCurso = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagem(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !descricao || !imagem) {
      alert('Preencha todos os campos!');
      return;
    }

    // Aqui estamos simulando um upload da imagem para obter uma URL
    // Em produção, você precisaria enviar `imagem` para um backend ou serviço de storage
    const curso = {
      titulo,
      descricao,
      urlImage: 'Imagem' // substitua com a URL real da imagem se estiver usando upload real
    };

    try {
      const response = await fetch('http://localhost:8080/Curso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(curso)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar curso');

      const data = await response.json();
      console.log('Curso cadastrado:', data);
      alert('Curso cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao cadastrar o curso.');
    }
  };

  return (
    <div>
      <div className="box-adicionar-curso">
        <div className="cabecalho-adicionar-curso">
          <h1>Adicionar Curso</h1>
          <p>Preencha os dados para criar um curso</p>
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
          <div className="input-imagem-box">
            <p>Imagem *</p>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Prévia da imagem" width="200" />}
          </div>
        </div>
        <button className="register-button" onClick={handleSubmit}>
          SALVAR
        </button>
      </div>
    </div>
  );
};

export default AdicionarCurso;
