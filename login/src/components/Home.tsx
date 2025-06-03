import Divider from "./Divider";
import HubDeNetwork from "./HubDeNetwork";
import HubDeProjeto from "./HubDeProjeto";
import LeiaMais from "./LeiaMais";
import Secction from "./secction";
import SecctionTurmas from "./SecctionTurmas";


const Home = () => {

    return (
       <div >
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

        <div className="historiaBox">
            <div className="sessoesImage">
                <img src="/images/background2.jpg" alt="" />
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
        </div>     
    </div>        
    );
};

export default Home;