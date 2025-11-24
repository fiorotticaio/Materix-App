import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SelectedMaterials.css';

const SelectedMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const highlights = location.state?.highlights || [];

  const textsArray = highlights.map((h) => h.text);

  return (
    <div className="selected-materials-container">
      <div className="selected-materials-header">
        <h1 className="selected-materials-title">Textos Marcados</h1>
        <button
          onClick={() => navigate('/plant-viewer')}
          className="back-button"
        >
          ← Voltar
        </button>
      </div>

      <div className="selected-materials-content">
        {highlights.length === 0 ? (
          <div className="empty-results">
            <p>Nenhum texto marcado encontrado.</p>
            <button
              onClick={() => navigate('/plant-viewer')}
              className="control-button"
            >
              Voltar ao Visualizador
            </button>
          </div>
        ) : (
          <>
            <div className="highlights-summary">
              <p className="summary-text">
                Total de textos marcados: <strong>{highlights.length}</strong>
              </p>
            </div>

            <div className="highlights-list-results">
              {highlights.map((highlight, index) => (
                <div key={highlight.id} className="highlight-result-card">
                  <div className="highlight-result-header">
                    <span className="highlight-number">#{index + 1}</span>
                    <span className="highlight-page-badge">
                      Página {highlight.page}
                    </span>
                  </div>
                  <div className="highlight-result-text">
                    {highlight.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="highlights-array-section">
              <h2>Array de Textos</h2>
              <pre className="array-display">
                {JSON.stringify(textsArray, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectedMaterials;

