import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MaterialsModal from "../components/MaterialsModal";
import "../styles/SelectedMaterials.css";

const SelectedMaterials = () => {
  const location = useLocation();
  const { extractedText } = location.state || { extractedText: "" };

  const [materials, setMaterials] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulação de materiais do backend
  const mockMaterialsFromBackend = [
    { id: 1, name: "Parafuso M6", category: "Fixação" },
    { id: 2, name: "Parafuso M8", category: "Fixação" },
    { id: 3, name: "Parafuso M10", category: "Fixação" },
    { id: 4, name: "Porca Aço Inox", category: "Fixação" },
    { id: 5, name: "Porca Zincada", category: "Fixação" },
    { id: 6, name: "Arruela 8mm", category: "Fixação" },
    { id: 7, name: "Arruela 10mm", category: "Fixação" },
    { id: 8, name: "Chumbador 10x100", category: "Ancoragem" },
    { id: 9, name: "Chumbador 12x120", category: "Ancoragem" },
    { id: 10, name: "Tirante Rosqueado", category: "Estrutura" },
    { id: 11, name: "Cantoneira 2x2", category: "Estrutura" },
    { id: 12, name: "Cantoneira 3x3", category: "Estrutura" },
    { id: 13, name: "Perfil U 100mm", category: "Estrutura" },
    { id: 14, name: "Perfil L 50mm", category: "Estrutura" },
    { id: 15, name: "Placa Aço 1/4", category: "Chapas" },
    { id: 16, name: "Placa Aço 1/8", category: "Chapas" },
    { id: 17, name: "Tubo Quadrado 2x2", category: "Tubos" },
    { id: 18, name: "Tubo Redondo 1\"", category: "Tubos" },
    { id: 19, name: "Solda E7018", category: "Consumíveis" },
    { id: 20, name: "Eletrodo 2.5mm", category: "Consumíveis" }
  ];

  useEffect(() => {
    if (!extractedText) return;

    const detectedMaterials = extractedText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const fakeResponse = detectedMaterials.map((mat) => ({
      name: mat,
      items: [
        { item: "Parafuso M8", qty: Math.floor(Math.random() * 5) + 1 },
        { item: "Porca Aço", qty: Math.floor(Math.random() * 3) + 1 },
        { item: "Arruela 12mm", qty: Math.floor(Math.random() * 4) + 1 },
      ],
    }));

    setMaterials(fakeResponse);
    updateSummary(fakeResponse);
  }, [extractedText]);

  const updateSummary = (materialsList) => {
    const summaryMap = {};
    materialsList.forEach((mat) => {
      mat.items.forEach(({ item, qty }) => {
        summaryMap[item] = (summaryMap[item] || 0) + qty;
      });
    });

    const summaryArr = Object.entries(summaryMap).map(([item, qty]) => ({
      item,
      qty,
    }));

    setSummary(summaryArr);
  };

  const handleOpenModal = async () => {
    setLoading(true);
    setShowModal(true);
    
    // Simula carregamento do backend
    setTimeout(() => {
      setAvailableMaterials(mockMaterialsFromBackend);
      setLoading(false);
    }, 800);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterials([]);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterials(prev => {
      const isAlreadySelected = prev.find(m => m.id === material.id);
      if (isAlreadySelected) {
        return prev.filter(m => m.id !== material.id);
      } else {
        return [...prev, material];
      }
    });
  };

  const handleAddSelectedMaterials = () => {
    if (selectedMaterials.length === 0) return;

    const newMaterials = selectedMaterials.map(mat => ({
      name: mat.name,
      items: [
        { item: "Parafuso M8", qty: Math.floor(Math.random() * 5) + 1 },
        { item: "Porca Aço", qty: Math.floor(Math.random() * 3) + 1 },
        { item: "Arruela 12mm", qty: Math.floor(Math.random() * 4) + 1 },
      ],
    }));

    const updatedMaterials = [...materials, ...newMaterials];
    setMaterials(updatedMaterials);
    updateSummary(updatedMaterials);
    handleCloseModal();
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
    updateSummary(updatedMaterials);
  };

  const handleExportPDF = () => {
    alert("PDF exportado com sucesso!");
    // Aqui você implementaria a lógica real de exportação
  };

  return (
    <div className="materials-container">
      {/* HEADER */}
      <header className="materials-header">
        <div className="header-content">
          <h1 className="materials-title">Materiais Identificados</h1>
          <button 
            className="add-materials-button"
            onClick={handleOpenModal}
          >
            <span className="button-icon">+</span>
            Adicionar Materiais
          </button>
        </div>
      </header>

      <div className="materials-content">
        {/* LISTA DE CARDS */}
        {materials.length > 0 ? (
          <div className="materials-grid">
            {materials.map((mat, index) => (
              <div key={index} className="material-card">
                <div className="material-card-header">
                  <h2 className="material-card-title">{mat.name}</h2>
                  <button 
                    className="remove-material-button"
                    onClick={() => handleRemoveMaterial(index)}
                    title="Remover material"
                  >
                    ×
                  </button>
                </div>
                <div className="material-items">
                  {mat.items.map((i, idx) => (
                    <div key={idx} className="material-item-row">
                      <span>{i.item}</span>
                      <span className="material-item-qty">{i.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2>Nenhum material encontrado</h2>
            <p>Adicione materiais manualmente ou faça upload de um arquivo</p>
            <button 
              className="add-materials-button-large"
              onClick={handleOpenModal}
            >
              <span className="button-icon">+</span>
              Adicionar Primeiro Material
            </button>
          </div>
        )}

        {/* RESUMO FINAL */}
        {summary.length > 0 && (
          <div className="summary-section">
            <h2 className="summary-title">Resumo Geral dos Itens</h2>

            <table className="summary-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade Total</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((s, index) => (
                  <tr key={index}>
                    <td>{s.item}</td>
                    <td>{s.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="export-button" onClick={handleExportPDF}>
              <span className="export-icon">📄</span>
              Exportar PDF
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <MaterialsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleAddSelectedMaterials}
        availableMaterials={availableMaterials}
        selectedMaterials={selectedMaterials}
        onMaterialSelect={handleMaterialSelect}
        loading={loading}
      />
    </div>
  );
};

export default SelectedMaterials;