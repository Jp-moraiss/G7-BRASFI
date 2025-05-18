import React, { useEffect, useState } from 'react';

const CoursesPage = () => {
  const [cursos, setCursos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/Curso')
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
      <div className="botaoAdicionar">
        <a href="/AdicionarCurso"><button>Adicionar Curso</button></a>
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
              <p>{curso.descricao}</p>
            </div>
            <div className="button-curso">
              <button>ASSISTIR AGORA!</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
