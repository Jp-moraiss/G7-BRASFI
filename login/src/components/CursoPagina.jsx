import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export const CursoPagina = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [videoAtual, setVideoAtual] = useState<string | null>(null);


  useEffect(() => {
    if (!id) {
      setError('ID do curso não encontrado');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/cursos/${id}`)
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

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  if (loading) {
    return <div className="loading-container"><p>Carregando curso...</p></div>;
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
          <li className={`menu-item ${openSubmenu === 'capitulos' ? 'open' : ''}`}>
            <h1
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu('capitulos');
              }}
              style={{ cursor: 'pointer' }}
            >
              {curso.titulo}{' '}
              <span className="arrow">
                {openSubmenu === 'capitulos' ? '^' : '˅'}
              </span>
            </h1>

            {openSubmenu === 'capitulos' && (
              <ul className="submenu">
                {curso.capitulos.map((capitulo) => (
                  <li key={capitulo.id} className="capitulo-item">
                    <div className="capitulo-header">
                        <h1>{capitulo.titulo}</h1>
                    </div>
                    
                    {/* Lista de vídeos do capítulo */}
                    {capitulo.videos && capitulo.videos.length > 0 && (
                      <ul className="videos-list">
                        {capitulo.videos.map((video) => (
                          <li key={video.id} className="video-item">
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                setVideoAtual(video.url);
                              }}
                              className="video-link"
                            >
                              {video.titulo}
                            </a>

                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="conteudo-principal">
        <div className="box-video">
          <div className="video-container">
            <iframe
              src={videoAtual ?? ''}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        </div>
        <div className="descricao-curso">
          <h1>Resumo do Curso - {curso.titulo}</h1>
          <p>{curso.descricao}</p>
        </div>
      </div>
    </div>
  );
}