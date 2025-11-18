import React from 'react';
import './styles/Logo.css';

const Logo = ({ size = 'medium', showText = true }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Hexágono externo laranja médio */}
          <polygon
            points="50,10 85,30 85,70 50,90 15,70 15,30"
            fill="#FF6B35"
            stroke="#FF5722"
            strokeWidth="1.5"
          />
          {/* Estrutura interna - L azul escuro (base e lado esquerdo) */}
          <path
            d="M 25 50 L 25 70 L 50 70 L 50 60 L 35 60 L 35 50 Z"
            fill="#1a2b4a"
          />
          {/* Barra/prisma laranja clara (elemento que sobe) */}
          <rect
            x="35"
            y="40"
            width="20"
            height="25"
            fill="#FF8C5A"
            rx="2"
          />
          {/* Gradiente sutil no topo da barra para efeito 3D */}
          <rect
            x="35"
            y="40"
            width="20"
            height="5"
            fill="rgba(255, 255, 255, 0.2)"
            rx="2"
          />
        </svg>
      </div>
      {showText && (
        <span className="logo-text">Materix</span>
      )}
    </div>
  );
};

export default Logo;

