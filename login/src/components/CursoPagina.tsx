import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  urlImage: string;
}

export const CursoPagina = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID do curso não encontrado');
      setLoading(false);
      return;
    }

    // Busca o curso específico pelo ID
    fetch(`http://localhost:8080/Curso/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Curso não encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setCurso(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar curso:', error);
        setError('Erro ao carregar o curso');
        setLoading(false);
      });
  }, [id]);

  const toggleSubmenu = (menuName: string | null) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erro</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="error-container">
        <h2>Curso não encontrado</h2>
        <p>O curso solicitado não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="body-curso">
      {/* Menu lateral */}
      <div className="container-curso">
        <div className="box-texts-curso">
          <li className={`menu-item ${openSubmenu === 'aulas' ? 'open' : ''}`}>
            <h1
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu('aulas');
              }}
              style={{ cursor: 'pointer' }}
            >
              {curso.titulo}{' '}
              <span className="arrow">{openSubmenu === 'aulas' ? '^' : '˅'}</span>
            </h1>
            {openSubmenu === 'aulas' && (
              <ul className="submenu">
                <li>
                  <a href={`/Curso/${curso.id}/aula/1`}>Aula 1</a>
                </li>
                <li>
                  <a href={`/Curso/${curso.id}/aula/2`}>Aula 2</a>
                </li>
              </ul>
            )}
          </li>
        </div>
      </div>

      {/* Conteúdo principal (vídeo + descrição) */}
      <div className="conteudo-principal">
        <div className="box-video">
          <div className="video-container">
            <iframe
              src=""
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        </div>
        <div className="descricao-curso">
          <h1>Resumo da Aula 1 - {curso.titulo}</h1>
          <p>{curso.descricao}</p>
          <p>
            A aula aborda os princípios e práticas das Finanças Solidárias, um modelo que
            prioriza a inclusão social, a cooperação e o desenvolvimento sustentável, em
            contraposição às dinâmicas tradicionais do mercado financeiro. São exploradas
            experiências como bancos comunitários, fundos rotativos solidários, cooperativas de
            crédito e clubes de troca, que visam democratizar o acesso a recursos financeiros e
            fortalecer economias locais.
          </p>
        </div>
      </div>
    </div>
  );
};