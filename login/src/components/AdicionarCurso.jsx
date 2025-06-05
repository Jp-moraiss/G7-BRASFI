import React, { useRef, useState } from 'react';

const AdicionarCurso = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | null>(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagem(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    setMensagem(null);

    if (!titulo || !descricao || !imagem) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const curso = {
      titulo,
      descricao,
      urlImage: 'Imagem'
    };

    try {
      const response = await fetch('http://localhost:8080/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(curso)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar curso');

      const data = await response.json();
      console.log('Curso cadastrado:', data);

      setMensagem('Curso cadastrado com sucesso!');
      setTipoMensagem('sucesso');
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
