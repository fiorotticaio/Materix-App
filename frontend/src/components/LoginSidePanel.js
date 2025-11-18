import React from 'react';
import Logo from './Logo';
import './styles/LoginSidePanel.css';

const LoginSidePanel = () => {
  return (
    <div className="login-side-panel">
      <div className="login-side-panel-overlay"></div>
      <div className="login-side-panel-content">
        <Logo size="large" />
        <h1 className="login-side-panel-title">
          Bem-vindo ao Materix
        </h1>
        <p className="login-side-panel-description">
          Gerencie seus projetos de construção com facilidade. 
          Gere plantas e listas de materiais de forma inteligente e eficiente.
        </p>
        <div className="login-side-panel-features">
          <div className="feature-item">
            <div className="feature-icon">📐</div>
            <div className="feature-text">
              <h3>Geração de Plantas</h3>
              <p>Crie plantas técnicas profissionais</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📋</div>
            <div className="feature-text">
              <h3>Listas de Materiais</h3>
              <p>Organize seus materiais automaticamente</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">
              <h3>Processo Rápido</h3>
              <p>Economize tempo e recursos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="login-side-panel-pattern"></div>
    </div>
  );
};

export default LoginSidePanel;

