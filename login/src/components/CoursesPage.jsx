import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSection, faVideo, faBook, faTrash } from '@fortawesome/free-solid-svg-icons';

const CoursesPage = () => {
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState('');
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    fetch('https://g7-brasfi.onrender.com/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error('Erro ao buscar cursos:', error));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email || parsedUser.login || '');
        setUser(parsedUser.name);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const cursosFiltrados = cursos.filter((curso) =>
    curso.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este curso?')) return;

    try {
      const response = await fetch(`https://g7-brasfi.onrender.com/cursos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar curso');
      }

      // Atualiza lista local removendo o curso deletado
      setCursos((prevCursos) => prevCursos.filter((curso) => curso.id !== id));
      alert('Curso deletado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Falha ao deletar curso.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div className="cabecalhoCursos">
        <h1>Bem Vindo, <strong>{user}</strong></h1>
      </div>

      <div className="cursos-serach">
        <h1>Cursos: </h1>
        <input
          placeholder="Pesquisar..."
          className="cursos-bar"
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      {isAdmin && (
        <div className="cursos-bottoes">
          <div className="botaoEditar">
            <a href="/AdicionarCurso">
              <button>
                <FontAwesomeIcon icon={faBook} style={{ color: '#fff', marginRight: '8px' }} />
                Adicionar Curso
              </button>
            </a>
          </div>
          <div className="botaoEditar">
            <a href="/AdicionarCapitulos">
              <button>
                <FontAwesomeIcon icon={faSection} style={{ color: '#fff', marginRight: '8px' }} />
                Capitulos
              </button>
            </a>
          </div>
          <div className="botaoEditar">
            <a href="/AdicionarVideos">
              <button>
                <FontAwesomeIcon icon={faVideo} style={{ marginRight: '8px' }} />
                Adicionar Vídeo
              </button>
            </a>
          </div>
        </div>
      )}

      <div className="course-container">
        {cursosFiltrados.map((curso, i) => (
          <div key={curso.id} className="course-card">
            <div className="image-course">
              <img src={curso.urlImage} alt="Imagem do curso" />
            </div>
            <div className="title-course">
              <h1>Curso {i + 1}: {curso.titulo}</h1>
            </div>
            <div className="descricao-course">
              <p>{curso.descricao}</p>
            </div>
            <div className="botoes-cursos" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="button-curso">
                <a href={`https://g7-brasfi.onrender.com/curso/${curso.id}`}>
                  <button>ASSISTIR AGORA!</button>
                </a>
              </div>
              {isAdmin && (
                <div className="button-curso">
                  <button
                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleDelete(curso.id)}
                    title="Deletar curso"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Excluir
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
