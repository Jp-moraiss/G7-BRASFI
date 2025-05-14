import {useState} from 'react'

export const CursoPagina = () => {

    const [openSubmenu, setOpenSubmenu] = useState(null); // novo estado
    
    const toggleSubmenu = (menuName: string | null) => {
        setOpenSubmenu(prev => (prev === menuName ? null : menuName));
    };

  return (
    
    <div className='body-curso'>
  {/* Menu lateral */}
  <div className="container-curso">
    <div className="box-texts-curso">
      <li className={`menu-item ${openSubmenu === 'chat' ? 'open' : ''}`}>
        <h1 href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('chat'); }}>
          Curso 1 - Ambientais <span className="arrow">{openSubmenu === 'chat' ? '^' : '˅'}</span>
        </h1>
        {openSubmenu === 'chat' && (
          <ul className="submenu">
            <li><a href="/video">Aula 1</a></li>
            <li><a href="/palestra">Aula 2</a></li>
          </ul>
        )}
      </li>
    </div>
  </div>

  {/* Conteúdo principal (vídeo + descrição) */}
  <div className="conteudo-principal">
    <div className="box-video">
      <div className="video-container">
        <div className="video-options">
          <p><i className="fa-solid fa-download"></i></p>
          <p><i className="fa-solid fa-sliders"></i></p>
          <p><i className="fa-solid fa-message"></i></p>
          <p><i className="fa-solid fa-expand"></i></p>
          <p><i className="fa-solid fa-play"></i></p>
        </div>
      </div>
      
    </div>
    <div className="descricao-curso">
      <h1>Resumo da Aula 1</h1>
      <p> A aula aborda os princípios e práticas das Finanças Solidárias, um modelo que prioriza a inclusão social, a cooperação e o desenvolvimento sustentável, em contraposição às dinâmicas tradicionais do mercado financeiro São exploradas experiências como bancos comunitários, 
        fundos rotativos solidários, cooperativas de crédito e clubes de troca, que visam democratizar o acesso a recursos financeiros e fortalecer economias locais.</p>
    </div>
   
  </div>
</div>

  )
}
