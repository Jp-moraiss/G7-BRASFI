import React, { useEffect, useState } from 'react';

const AdicionarVideos = () => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [capituloId, setCapituloId] = useState('');
  const [mensagem, setMensagem] = useState();
  const [tipoMensagem, setTipoMensagem] = useState();

  const [cursos, setCursos] = useState([]);
  const [capitulos, setCapitulos] = useState([]);

  // Buscar cursos ao carregar
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('https://g7-brasfi.onrender.com/cursos');
        if (!response.ok) throw new Error(`Erro ao buscar cursos: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data)) {
          setCursos(data);
        } else {
          console.error('Resposta de cursos não é um array:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  // Buscar capítulos do curso selecionado
  useEffect(() => {
    if (!cursoId) {
      setCapitulos([]);
      setCapituloId('');
      return;
    }

    const fetchCapitulos = async () => {
      try {
        const response = await fetch(`https://g7-brasfi.onrender.com/capitulos/curso/${cursoId}`);
        if (!response.ok) throw new Error(`Erro ao buscar capítulos: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data)) {
          setCapitulos(data);
        } else {
          console.error('Resposta de capítulos não é um array:', data);
          setCapitulos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar capítulos:', error);
        setCapitulos([]);
      }
    };

    fetchCapitulos();
  }, [cursoId]);

  const handleSubmit = async () => {
    if (!titulo || !url || !capituloId) {
      setMensagem('Preencha todos os campos!');
      setTipoMensagem('erro');
      return;
    }

    const video = {
      titulo,
      url,
      capitulo: {
        id: capituloId,
      },
    };

    try {
      const response = await fetch('https://g7-brasfi.onrender.com/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(video)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar vídeo');

      const data = await response.json();
      console.log('Vídeo cadastrado:', data);
      setMensagem('Vídeo adicionado com sucesso!');
      setTipoMensagem('sucesso');

      // Resetar campos
      setTitulo('');
      setUrl('');
      setCursoId('');
      setCapituloId('');
      setCapitulos([]);
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Falha ao adicionar vídeo!');
      setTipoMensagem('erro');
    }
  };

  return (
    <div>
      <div className="box-adicionar-curso">
        <div className="cabecalho-adicionar-curso">
          <h1>Adicionar Vídeos</h1>
          <p>Selecione o curso e o capítulo para adicionar um vídeo</p>
        </div>

        <div className="input-curso-area">

          <div className="input-descrição-box">
            <p>Curso *</p>
            <select
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
            >
              <option value="">Selecione o curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-descrição-box">
            <p>Capítulo *</p>
            <select
              value={capituloId}
              onChange={(e) => setCapituloId(e.target.value)}
              disabled={!cursoId}
            >
              <option value="">Selecione o capítulo</option>
              {capitulos.map((capitulo) => (
                <option key={capitulo.id} value={capitulo.id}>
                  {capitulo.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-descrição-box">
            <p>Título do Vídeo *</p>
            <input
              type="text"
              placeholder="Digite o título do vídeo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="input-descrição-box">
            <p>URL do Vídeo *</p>
            <input
              type="text"
              placeholder="Digite a URL do vídeo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
