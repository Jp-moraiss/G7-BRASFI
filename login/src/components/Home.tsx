import Divider from "./Divider";


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
                        <p>O QUE É A BRASFI</p>
                    </div>
                    <div className="box-informacoes-brasfi">
                        <h1>DESENVOLVENDO LIDERES E VIABILIZANDO SOLUÇÕES ! </h1>
                        <p>Role para baixo <i className="fa-solid fa-angle-down"></i></p>
                    </div>
                    
                </div>
            </div>
        </div>

        <div className="historiaBox">
             <div className="historiaTexts">
                <p>Historia</p>
                <h1>Como surgiu a brasfi ?</h1>
                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus finibus, neque vitae lacinia hendrerit, augue libero volutpat nisi, sed bibendum nisi nulla eu mi. Integer sagittis, nibh non tincidunt cursus, sapien nisl volutpat elit, ut finibus lectus velit ut nulla. Proin vitae nunc non elit facilisis tincidunt. Morbi tincidunt, massa ac malesuada.</h3>
            </div>
            <div className="historiaImage">
                <img src="/images/historia.jpg" alt="" />
            </div>
           
        </div>

       </div>
    );
};

export default Home;