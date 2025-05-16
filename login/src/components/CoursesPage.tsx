import React from 'react'

const CoursesPage = () => {
  return (
    <div>
      <div className="cursos-serach">
        <h1>Cursos: </h1>
        <input placeholder='Pesquisar...' className='cursos-bar' type="text"  />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="course-container">
        <div className="image-course">
            <img src="./public/images/image.png" alt="" />
        </div>
        <div className="title-course">
            <h1>Curso 1: Finanças Solidárias e Sustentáveis para Projetos Sociais</h1>
        </div>
        <div className="descricao-course">
            <p>Fortaleça projetos sociais com ferramentas como cooperativas, fundos solidários, parcerias e redes de troca. Este curso mostra caminhos acessíveis para gerar renda, captar recursos e gerir finanças de forma transparente.</p>
        </div>
        <div className="button-curso">
            <button>ASSISTIR AGORA!</button>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
