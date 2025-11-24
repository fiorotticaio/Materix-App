import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { PDFDocument, rgb } from 'pdf-lib';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '../styles/PlantViewer.css';

const PlantViewer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [highlightMode, setHighlightMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [tempRect, setTempRect] = useState(null);

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

  // INÍCIO DO DESENHO
  const handleMouseDown = (e) => {
    if (!highlightMode) return;

    const pageLayer = e.target.closest('.rpv-core__page-layer');
    if (!pageLayer) return;

    const rect = pageLayer.getBoundingClientRect();

    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      page: currentPage + 1,
    });

    setIsDrawing(true);
  };

  // ATUALIZA O RETÂNGULO
  const handleMouseMove = (e) => {
    if (!isDrawing || !startPoint) return;

    const pageLayer = e.target.closest('.rpv-core__page-layer');
    if (!pageLayer) return;

    const rect = pageLayer.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setTempRect({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y),
      page: startPoint.page,
    });
  };

  // FINALIZA O DESTAQUE
  const handleMouseUp = () => {
    if (tempRect) {
      setHighlights(prev => [...prev, { ...tempRect, id: Date.now() }]);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setTempRect(null);
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

  const handleFinish = () => {
    if (highlights.length === 0) {
      alert('Nenhum texto marcado. Por favor, marque pelo menos um texto antes de concluir.');
      return;
    }

    // Navegar para a página de resultados com os highlights
    navigate('/selected-materials', {
      state: { highlights: highlights }
    });
  };

  const exportPdf = async () => {
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    highlights.forEach(h => {
      const page = pdfDoc.getPage(h.page - 1);
      const pageHeight = page.getHeight();

      page.drawRectangle({
        x: h.x,
        y: pageHeight - h.y - h.height,
        width: h.width,
        height: h.height,
        color: rgb(1, 1, 0),
        opacity: 0.35
      });
    });

    const modified = await pdfDoc.save();
    const blob = new Blob([modified], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'marcado.pdf';
    a.click();
    URL.revokeObjectURL(url);
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
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
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

                        <div style={{ position: 'absolute', top: 0, left: 0 }}>

                          {/* Retângulo em desenho */}
                          {tempRect && tempRect.page === pageIndex + 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: tempRect.x,
                                top: tempRect.y,
                                width: tempRect.width,
                                height: tempRect.height,
                                backgroundColor: 'rgba(124, 239, 91, 1)',
                                border: '1px solid yellow',
                                pointerEvents: 'none'
                              }}
                            />
                          )}

                          {/* Retângulos já finalizados */}
                          {pageHighlights.map(h => (
                            <div
                              key={h.id}
                              className="highlight-overlay"
                              style={{
                                position: 'absolute',
                                backgroundColor: 'rgba(124, 239, 91, 1)',
                                left: h.x,
                                top: h.y,
                                width: h.width,
                                height: h.height,
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
                <div className="highlights-sidebar-footer">
                  <button
                    onClick={exportPdf}
                    className="control-button control-button-success finish-button"
                  >
                    ✓ Salvar PDF
                  </button>
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