import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSection, faVideo, faBook } from '@fortawesome/free-solid-svg-icons';


const CoursesPage = () => {
  const [cursos, setCursos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error('Erro ao buscar cursos:', error));
  }, []);

  useEffect(() => {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
              try {
                  const parsedUser = JSON.parse(storedUser);
                  setUserEmail(parsedUser.email || parsedUser.login || "");
                  setUser(parsedUser.name)
                  setIsAuthenticated(true);
                  setIsAdmin(parsedUser.role === "ADMIN");
                  console.log("Dados do usuário carregados:", parsedUser);
              } catch (error) {
                  console.error("Erro ao carregar dados do usuário:", error);
              }
          } else {
              console.log("Nenhum usuário encontrado no localStorage");
          }
      }, []);

  return (
    <div>
      <div className="cabecalhoCursos">
        <h1>Bem Vindo, <strong>{user}</strong></h1>
      </div>
      <div className="cursos-serach">
        <h1>Cursos: </h1>
        <input placeholder='Pesquisar...' className='cursos-bar' type="text" />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

    if ({isAdmin}) {
      <div className="cursos-bottoes">
          <div className="botaoEditar">
            <a href="/AdicionarCurso">
            <button>
              <FontAwesomeIcon icon={faBook} style={{color: "#ffffff", marginRight: '8px'}} />
              Adicionar Curso
              </button>
            </a>
          </div>
          <div className="botaoEditar">
            <a href="/AdicionarCapitulos">
              <button>
              <FontAwesomeIcon icon={faSection} style={{color: "#ffffff", marginRight: '8px'}} />
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
      
      
    }
      
      <div className="course-container">
        {cursos.map((curso, i) => (
          <div key={curso.id} className="course-card">
            <div className="image-course">
              <img src={curso.urlImage} alt="Imagem do curso" />
            </div>
            <div className="title-course">

              <h1>Curso {i + 1}: {curso.titulo}</h1>
            </div>
            <div className="descricao-course">
              <p>{curso.descricao}</p>z
            </div>
            <div className="botoes-cursos">
                <div className="button-curso">
                  <button>ASSISTIR AGORA!</button>
                </div>
                
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
