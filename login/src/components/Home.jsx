import ContatoSecction from "./ContatoSecction";
import Divider from "./Divider";
import HubDeNetwork from "./HubDeNetwork";
import HubDeProjeto from "./HubDeProjeto";
import LeiaMais from "./LeiaMais";
import Secction from "./Secction";
import SecctionQuestionario from "./SecctionQuestionario";
import SecctionTurmas from "./SecctionTurmas";


const Home = () => {

    return (
       <div style={{backgroundColor: '#0F230A'}} >
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
                        <h1>DESENVOLVENDO LIDERES E VIABILIZANDO SOLUÇÕES ! </h1>
                        <p>Role para baixo <i className="fa-solid fa-angle-down"></i></p>
                    </div>
                </div>
            </div>
        </div>

        <div className="sessoes">
            <div className="historiaBox">
                <Secction />
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
                    <HubDeProjeto />
                    <HubDeNetwork />
                </div>        
            </div>

            <div className="historiaBox">
                <SecctionTurmas />
                <div className="historiaImage">
                    <img src="/images/background3.png" alt="" />
                </div>
            </div>

            <div className="questionarioBox">
                <div className="questionarioImage">
                    <img src="/images/background4.jpg" alt="" />
                </div>
                
                <div className="questionarioContent">
                    <SecctionQuestionario />
                </div>
            </div>

            <div className="contatosecction">
                <ContatoSecction />
            </div>

        </div>     
    </div>        
    );
};

export default Home;