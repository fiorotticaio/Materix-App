import React, { useEffect } from 'react';
import './styles/MaterialsModal.css';

const MaterialsModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableMaterials, 
  selectedMaterials, 
  onMaterialSelect,
  loading 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Forçar reflow para garantir que o CSS seja aplicado
      const reflow = document.body.clientHeight; // Atribuir a uma variável
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const groupedMaterials = availableMaterials.reduce((acc, material) => {
    const category = material.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {});

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="materials-modal-overlay" onClick={handleOverlayClick}>
      <div className="materials-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-header">
          <h2 className="materials-modal-title">Selecionar Materiais</h2>
          <button 
            className="materials-modal-close-button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="materials-modal-body">
          {loading ? (
            <div className="materials-loading-modal">
              <div className="materials-loading-spinner"></div>
              <p>Carregando materiais...</p>
            </div>
          ) : (
            <>
              <div className="materials-selected-count">
                {selectedMaterials.length} material(s) selecionado(s)
              </div>
              
              <div className="materials-list">
                {Object.entries(groupedMaterials).map(([category, materials]) => (
                  <div key={category} className="materials-category-section">
                    <h3 className="materials-category-title">{category}</h3>
                    <div className="materials-category-materials">
                      {materials.map(material => (
                        <div
                          key={material.id}
                          className={`materials-option ${
                            selectedMaterials.find(m => m.id === material.id) 
                              ? 'materials-option-selected' 
                              : ''
                          }`}
                          onClick={() => onMaterialSelect(material)}
                        >
                          <span className="materials-option-name">{material.name}</span>
                          <span className="materials-option-check">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="materials-modal-footer">
          <button 
            className="materials-modal-cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="materials-modal-confirm-button"
            onClick={onConfirm}
            disabled={selectedMaterials.length === 0}
          >
            Adicionar ({selectedMaterials.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;