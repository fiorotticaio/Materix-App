import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import './styles/home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="homepage-header">
          <Logo size="large" />
          <h1 className="homepage-title">Bem-vindo ao Sistema</h1>
          <p className="homepage-subtitle">
            Escolha uma das opções abaixo para continuar
          </p>
        </div>

        <div className="homepage-cards">
          <div className="feature-card">
            <div className="feature-card-icon">
              <span>📐</span>
            </div>
            <h3 className="feature-card-title">Visualizador de Plantas</h3>
            <p className="feature-card-description">
              Visualize e interaja com plantas em PDF, faça marcações e 
              destaque informações importantes nos seus projetos.
            </p>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => handleNavigation('/plant-viewer')}
              icon={<span>👁️</span>}
            >
              Acessar Visualizador
            </Button>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <span>📋</span>
            </div>
            <h3 className="feature-card-title">Gerador de Listas</h3>
            <p className="feature-card-description">
              Crie e gerencie listas de materiais de forma eficiente, 
              com cálculos automáticos e exportação de relatórios.
            </p>
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => handleNavigation('/selected-materials')}
              icon={<span>⚡</span>}
            >
              Gerar Listas
            </Button>
          </div>
        </div>

        <div className="homepage-features">
          <h3 className="features-title">Recursos Disponíveis</h3>
          <div className="features-grid">
            <div className="feat-item">
              <div className="feat-item-icon">🎯</div>
              <div className="feat-item-content">
                <h4>Precisão</h4>
                <p>Cálculos precisos e detalhados</p>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-item-icon">🚀</div>
              <div className="feat-item-content">
                <h4>Agilidade</h4>
                <p>Processamento rápido e eficiente</p>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-item-icon">💾</div>
              <div className="feat-item-content">
                <h4>Exportação</h4>
                <p>Exporte para múltiplos formatos</p>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-item-icon">🔒</div>
              <div className="feat-item-content">
                <h4>Segurança</h4>
                <p>Seus dados protegidos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="homepage-footer">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Sair do Sistema
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;