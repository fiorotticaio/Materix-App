import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PlantViewer.css';

const PlantViewer = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [highlightMode, setHighlightMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Configurar o plugin de layout padrão
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
  });

  const onDocumentLoadSuccess = () => {
    setHighlights([]);
    setCurrentPage(0);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target?.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      // Revogar URL anterior se existir
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      
      setFile(selectedFile);
      
      // Criar URL do objeto para o PDF
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
      
      setHighlights([]);
      setCurrentPage(0);
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
    }
  };

  const handleTextSelection = (event) => {
    if (!highlightMode) return;
  
    const selection = window.getSelection();
    const text = selection.toString().trim();
  
    if (!text) return;
  
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    // Posição do canvas/textLayer da página
    const pageLayer = event.target.closest('.rpv-core__page-layer');
    if (!pageLayer) return;
  
    const pageRect = pageLayer.getBoundingClientRect();
  
    // Coordenadas relativas à página
    const x = rect.left - pageRect.left;
    const y = rect.top - pageRect.top;
  
    const highlight = {
      id: Date.now(),
      text,
      x,
      y,
      width: rect.width,
      height: rect.height,
      page: currentPage + 1,
    };
  
    setHighlights(prev => [...prev, highlight]);
    selection.removeAllRanges();
  };
  

  const removeHighlight = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const handleCloseFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setHighlights([]);
  };

  return (
    <div className="plant-viewer-container">
      <div className="plant-viewer-header">
        <h1 className="plant-viewer-title">Visualizador de Plantas</h1>
        <div className="plant-viewer-controls">
          {!file && (
            <div className="file-upload-container">
              <label htmlFor="pdf-upload" className="file-upload-label">
                <span className="file-upload-icon">📄</span>
                <span>Carregar PDF</span>
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-upload-input"
              />
            </div>
          )}
          
          {file && (
            <>
              <button
                onClick={() => setHighlightMode(!highlightMode)}
                className={`control-button ${highlightMode ? 'control-button-active' : 'control-button-secondary'}`}
                title={highlightMode ? 'Desativar marca-texto' : 'Ativar marca-texto'}
              >
                {highlightMode ? '🖍️ Marca-texto ON' : '🖍️ Marca-texto OFF'}
              </button>
              
              <button
                onClick={handleCloseFile}
                className="control-button control-button-secondary"
              >
                Novo PDF
              </button>
            </>
          )}
        </div>
      </div>

      <div className="plant-viewer-content">
        {!file || !fileUrl ? (
          <div className="empty-state">
            <div className="empty-state-icon">📐</div>
            <h2>Nenhum PDF carregado</h2>
            <p>Carregue um arquivo PDF para visualizar a planta do projeto</p>
            <label htmlFor="pdf-upload-empty" className="file-upload-label-large">
              <span className="file-upload-icon">📄</span>
              <span>Selecionar Arquivo PDF</span>
            </label>
            <input
              id="pdf-upload-empty"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-upload-input"
            />
          </div>
        ) : (
          <div className="pdf-viewer-wrapper">
            <div
              className={`pdf-container ${highlightMode ? 'highlight-mode-active' : ''}`}
              onMouseUp={handleTextSelection}
              style={{ position: 'relative' }}
            >
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div style={{ height: '750px', width: '100%', position: 'relative' }}>
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoad={onDocumentLoadSuccess}
                  renderPage={(props) => {
                    const { canvasLayer, textLayer, pageIndex, scale } = props;

                    const pageHighlights = highlights.filter(h => h.page === pageIndex + 1);

                    return (
                      <>
                        {canvasLayer.children}

                        {/* Overlay dinâmico FIXO na página */}
                        <div style={{ position: 'absolute', top: 0, left: 0 }}>
                          {pageHighlights.map(h => (
                            <div
                              key={h.id}
                              className="highlight-overlay"
                              style={{
                                position: 'absolute',
                                backgroundColor: 'rgba(255, 255, 0, 0.35)',
                                borderRadius: '2px',
                                left: h.x * scale,
                                top: h.y * scale,
                                width: h.width * scale,
                                height: h.height * scale,
                                pointerEvents: 'auto'
                              }}
                              onClick={() => removeHighlight(h.id)}
                            />
                          ))}
                        </div>

                        {textLayer.children}
                      </>
                    );
                  }}
                />
                  
                  {/* Renderizar highlights */}
                  {highlights.length > 0 && (
                    <div className="highlights-overlay-container">
                      {highlights.map(highlight => (
                        <div
                          key={highlight.id}
                          className="highlight-overlay"
                          style={{
                            left: `${highlight.x}px`,
                            top: `${highlight.y}px`,
                            width: `${highlight.width}px`,
                            height: `${highlight.height}px`,
                            pointerEvents: 'auto',
                          }}
                          onClick={() => removeHighlight(highlight.id)}
                          title="Clique para remover"
                        >
                          <span className="highlight-text">{highlight.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Worker>
            </div>
            
            {highlights.length > 0 && (
              <div className="highlights-sidebar">
                <h3>Marcadores ({highlights.length})</h3>
                <div className="highlights-list">
                  {highlights.map(highlight => (
                    <div key={highlight.id} className="highlight-item">
                      <div className="highlight-item-content">
                        <span className="highlight-item-text">{highlight.text}</span>
                        <span className="highlight-item-page">Página {highlight.page}</span>
                      </div>
                      <button
                        onClick={() => removeHighlight(highlight.id)}
                        className="highlight-remove-button"
                        title="Remover"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantViewer;