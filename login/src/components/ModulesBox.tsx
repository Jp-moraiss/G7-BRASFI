import React from 'react'
import BoxAchievementsModule from './BoxAchievementsModule'

const ModulesBox = () => {
  return (
    <div>
      <div className="box-modules">
        <div className="course-informations">
          <div className="course-image-module">
            <img src="./public/images/course-module.png" alt="" />
          </div>
          <div className="box-informations-course">
            <p className='module-text-course'>Modulo 1</p>
            <h1>Economia colaborativa</h1>
            <p className='description-text-course'>Fortaleça projetos sociais com ferramentas como cooperativas, fundos solidários, parcerias e redes de troca.</p>
          </div>
        </div>

        <div className="bar-progress">
          <div className='text-bar'>
            <p>0% Concluido</p>
          </div>
        </div>

        <div className="box-achievements-module">
          <BoxAchievementsModule />
        </div>
        
      </div>
    </div>
  )
}

export default ModulesBox
