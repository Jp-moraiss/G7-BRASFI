import React from 'react'

const ContatoSecction = () => {
  return (
    <div>
      <div className="contato">
        <div className="cabecalhoContato">
            <p>Contato</p>
            <h1>ENTRE EM CONTATO E SAIBA MAIS !</h1>
        </div>
        

        <div className='boxInputContato'>
            <div className="inputBoxContato">
                <h2>Nome</h2>
                <input type="text" placeholder='(Campo Obrigatorio)' />
                <h2>E-mail</h2>
                <input type="text" placeholder='(Campo Obrigatorio)' />
            </div>
            <button>Enviar</button>
            
        </div>
      </div>
    </div>
  )
}

export default ContatoSecction
