import React, { useState } from 'react';


const BrasfiFooter = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredBottomLink, setHoveredBottomLink] = useState(null);

  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-accent-bar"></div>
        
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="logo">
              <img src="/image/logoBrasfi.png" alt="" />
            </div>
            <p className="brand-description">
              Liderança e soluções em finanças e investimentos sustentáveis.
            </p>
          </div>

          {/* Topics Section */}
          <div className="footer-section">
            <h3 className="section-title">
              Tópicos
              <div className="title-underline"></div>
            </h3>
            <ul className="footer-links">
              {[
                'Sobre a Brasfi',
                'Contribuidores', 
                'Encontro',
                'Entre em contato',
                'Política de privacidade'
              ].map((item, index) => (
                <li key={index} className="link-item">
                  <a
                    href="#"
                    className={`footer-link ${hoveredLink === `topic-${index}` ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLink(`topic-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="section-title">
              Redes Sociais
              <div className="title-underline"></div>
            </h3>
            <ul className="footer-links">
              <a href="https://www.instagram.com/brasfi_/" target='_blank'><i class="fa-brands fa-instagram"></i> Instagram</a>
            </ul>
          </div>

          {/* More About BRASFI Section */}
          <div className="footer-section">
            <h3 className="section-title">
              Mais sobre BRASFI
              <div className="title-underline"></div>
            </h3>
            <ul className="footer-links">
              {[
                'O time',
                'Empregos',
                'Conferência'
              ].map((item, index) => (
                <li key={index} className="link-item">
                  <a
                    href="#"
                    className={`footer-link ${hoveredLink === `more-${index}` ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLink(`more-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            Copyright 2025 BRASFI, Inc.{' '}
            <a
              href="#"
              className={`bottom-link ${hoveredBottomLink === 'terms' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredBottomLink('terms')}
              onMouseLeave={() => setHoveredBottomLink(null)}
            >
              Terms
            </a>
            {' & '}
            <a
              href="#"
              className={`bottom-link ${hoveredBottomLink === 'privacy' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredBottomLink('privacy')}
              onMouseLeave={() => setHoveredBottomLink(null)}
            >
              Privacy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrasfiFooter;