import React, { useState } from 'react';

const AdicionarCurso = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagem(null);
      setPreview(null);
    }
  };

  const uploadImage = async () => {
    if (!imagem) return null;

    const formData = new FormData();
    formData.append('file', imagem);

    try {
      const response = await fetch('http://localhost:8080/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload da imagem');
      }

      const imageUrl = await response.text(); // Seu backend retorna a URL como texto simples
      return imageUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      setMensagem('Erro ao enviar imagem.');
      setTipoMensagem('erro');
      return null;
    }
  };

  const handleSubmit = async () => {
    setMensagem(null);

    if (!titulo || !descricao || !imagem) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return; // interrompe se o upload falhar

    const curso = {
      titulo,
      descricao,
      urlImage: imageUrl,
    };

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar curso');

      const data = await response.json();
      console.log('Curso cadastrado:', data);

      setMensagem('Curso cadastrado com sucesso!');
      setTipoMensagem('sucesso');

      // Limpa campos
      setTitulo('');
      setDescricao('');
      setImagem(null);
      setPreview(null);

    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Falha ao cadastrar o curso.');
      setTipoMensagem('erro');
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
          <div className="input-descrição-box">
            <p>Título *</p>
            <input
              type="text"
              placeholder="Digite o Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="input-descrição-box">
            <p>Descrição *</p>
            <input
              type="text"
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

export default AdicionarCurso;
