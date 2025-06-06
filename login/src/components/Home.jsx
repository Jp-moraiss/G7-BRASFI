import { useEffect, useState } from "react";
import ContatoSecction from "./ContatoSecction";
import Divider from "./Divider";
import HubDeNetwork from "./HubDeNetwork";
import HubDeProjeto from "./HubDeProjeto";
import LeiaMais from "./LeiaMais";
import Secction from "./Secction";
import SecctionQuestionario from "./SecctionQuestionario";
import SecctionTurmas from "./SecctionTurmas";

const Home = () => {
  const [landpage, setLandpage] = useState([]);

  const buscarInformacoes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/landpages`);
      const data = await response.json();
      setLandpage(data);
      console.log(data);
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
    }
  };

  useEffect(() => {
    buscarInformacoes();
  }, []);

  return (
    <div style={{ backgroundColor: '#0F230A' }}>
      {landpage.map((p, index) => (
        <div key={index}>
          <div className="homeContainer">
            <div className="gradientOverlay"></div>
            <div className="initialText">
              <div className="backgroundImage">
                <img src="/images/background.png" alt="" />
              </div>
              <div className="boxBrasfi">
                <div className="dividerBrasfi">
                  <Divider />
                  <p>O QUE É A BRASFI ?</p>
                </div>
                <div className="box-informacoes-brasfi">
                  <h1>{p.tituloBrasfi}</h1>
                  <p>Role para baixo <i className="fa-solid fa-angle-down"></i></p>
                </div>
              </div>
            </div>
          </div>

          <div className="sessoes">
            <div className="historiaBox">
               <div className="historiaBox">
             <div className="historiaTexts">
                <p>Historia</p>
                <h1>Como surgiu a brasfi ?</h1>
                <h3>{p.historiaBrasfi}</h3>
                <LeiaMais />
            </div> 
        </div>
              <div className="historiaImage">
                <img src="/images/historia.jpg" alt="" />
              </div>
            </div>

            <div className="hubBox">
              <div className="hub">
                <h2>Como Atuamos ?</h2>
                <h1>Nossos Hubs</h1>
              </div>
              <div className="hubBrasfi">
                <div className="historiaBox">
                    <div className="historiaTexts">
                        <h1>Hub de Projetos</h1>
                        <h3>{p.hubProjetos}</h3>
                        <LeiaMais />
                    </div> 
                    <div className="historiaBox">
                        <div className="historiaTexts">
                            <h1>Hub de Networking</h1>
                            <h3>{p.hubNetworking}</h3>
                            <LeiaMais />
                        </div> 
                    </div>
                </div>
              </div>
            </div>

            <div className="historiaBox">
              <div className="historiaBox">
             <div className="historiaTexts">
                <p>FAÇA PARTE</p>
                <h1>ENTRE NESSA JORNADA COM A GENTE</h1>
                <h3>{p.recrutamento}</h3>
                <LeiaMais />
                </div> 
            </div>
              <div className="historiaImage">
                <img src="/images/background3.png" alt="" />
              </div>
            </div>

            <div className="questionarioBox">
              <div className="questionarioImage">
                <img src="/images/background4.jpg" alt="" />
              </div>

              <div className="questionarioContent">
                <div className='blur'>
                    <div className="questionario">
                        <h1>QUESTIONÁRIO</h1>
                        <p>{p.questionario}</p>
                        <div className="quetionarioBotao">
                            <button class="quest_button">Ir para o Questionário</button>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="contatosecction">
              <ContatoSecction />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
